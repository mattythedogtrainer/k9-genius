import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../../trpc';
import { db, collections } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

export const lmsCertificationRouter = router({
  // Get user's certifications
  getMyCertifications: protectedProcedure.query(async ({ ctx }) => {
    const candidacySnapshot = await collections.lmsCertCandidacies
      .where('userId', '==', ctx.userId)
      .get();

    const candidacies = [];
    for (const doc of candidacySnapshot.docs) {
      const candidacy = { id: doc.id, ...doc.data() };

      // Fetch certification details
      const certSnapshot = await collections.lmsCertifications.doc(candidacy.certificationId).get();
      const certification = { id: certSnapshot.id, ...certSnapshot.data() };

      // Fetch required courses
      const coursesSnapshot = await collections.lmsCertCourses
        .where('certificationId', '==', candidacy.certificationId)
        .orderBy('sortOrder', 'asc')
        .get();

      const requiredCourses = coursesSnapshot.docs.map(courseDoc => ({
        id: courseDoc.id,
        ...courseDoc.data(),
      }));

      candidacies.push({
        ...candidacy,
        certification: {
          ...certification,
          requiredCourses,
        },
      });
    }

    return candidacies;
  }),

  // Get certification detail with eligibility check
  getCertificationDetail: protectedProcedure
    .input(z.object({ certificationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const certSnapshot = await collections.lmsCertifications.doc(input.certificationId).get();
      if (!certSnapshot.exists) throw new Error('Certification not found');

      const certification = { id: certSnapshot.id, ...certSnapshot.data() };

      // Fetch required courses with sorting
      const coursesSnapshot = await collections.lmsCertCourses
        .where('certificationId', '==', input.certificationId)
        .orderBy('sortOrder', 'asc')
        .get();

      const requiredCourses = coursesSnapshot.docs.map(courseDoc => ({
        id: courseDoc.id,
        ...courseDoc.data(),
      }));

      // Get candidacy
      const candidacySnapshot = await collections.lmsCertCandidacies
        .where('userId', '==', ctx.userId)
        .where('certificationId', '==', input.certificationId)
        .get();
      const candidacy = candidacySnapshot.docs[0] ? { id: candidacySnapshot.docs[0].id, ...candidacySnapshot.docs[0].data() } : null;

      // Check course completion for eligibility
      const requiredCourseIds = requiredCourses
        .filter(rc => rc.isRequired)
        .map(rc => rc.courseId);

      const completedEnrollments = [];
      if (requiredCourseIds.length > 0) {
        const enrollmentSnapshot = await collections.lmsEnrollments
          .where('userId', '==', ctx.userId)
          .where('completedAt', '!=', null)
          .get();

        for (const doc of enrollmentSnapshot.docs) {
          const enrollment = doc.data();
          if (requiredCourseIds.includes(enrollment.courseId)) {
            completedEnrollments.push(enrollment);
          }
        }
      }

      const allRequiredComplete = completedEnrollments.length === requiredCourseIds.length;

      return {
        certification: {
          ...certification,
          requiredCourses,
        },
        candidacy,
        eligibility: {
          allRequiredCoursesComplete: allRequiredComplete,
          completedCourseIds: completedEnrollments.map(e => e.courseId),
          isEligibleForExam: allRequiredComplete,
        },
      };
    }),

  // Admin: create certification
  adminCreate: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      overview: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      validityMonths: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const docRef = await collections.lmsCertifications.add({
        ...input,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    }),

  // Admin: add required course to certification
  adminAddCourse: adminProcedure
    .input(z.object({
      certificationId: z.string(),
      courseId: z.string(),
      isRequired: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      // Get max sortOrder for this certification
      const coursesSnapshot = await collections.lmsCertCourses
        .where('certificationId', '==', input.certificationId)
        .orderBy('sortOrder', 'desc')
        .limit(1)
        .get();

      let maxSort = 0;
      if (!coursesSnapshot.empty) {
        maxSort = coursesSnapshot.docs[0].data().sortOrder ?? 0;
      }

      const docRef = await collections.lmsCertCourses.add({
        ...input,
        sortOrder: maxSort + 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    }),
});

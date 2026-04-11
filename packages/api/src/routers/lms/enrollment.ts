import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../../trpc';
import { db, collections } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

export const lmsEnrollmentRouter = router({
  // Get current user's enrollments with course info and progress
  getMyEnrollments: protectedProcedure.query(async ({ ctx }) => {
    const enrollmentSnap = await collections.lmsEnrollments
      .where('userId', '==', ctx.userId)
      .orderBy('lastAccessedAt', 'desc')
      .get();

    const enrollments = [];
    for (const enrollDoc of enrollmentSnap.docs) {
      const enrollData = enrollDoc.data();

      // Get course
      const courseDoc = await collections.courses.doc(enrollData.courseId).get();
      if (!courseDoc.exists) continue;

      const courseData = courseDoc.data();

      // Get modules for this course
      const modulesSnap = await collections.modules
        .where('courseId', '==', enrollData.courseId)
        .orderBy('sortOrder', 'asc')
        .get();

      const modules = [];
      for (const modDoc of modulesSnap.docs) {
        const modData = modDoc.data();

        // Get lessons for this module
        const lessonsSnap = await collections.lessons
          .where('moduleId', '==', modDoc.id)
          .get();

        const lessons = lessonsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        modules.push({ id: modDoc.id, ...modData, lessons });
      }

      enrollments.push({
        id: enrollDoc.id,
        ...enrollData,
        course: { id: courseDoc.id, ...courseData, modules },
      });
    }

    return enrollments;
  }),

  // Get a specific enrollment with full progress
  getEnrollment: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Find enrollment
      const enrollSnap = await collections.lmsEnrollments
        .where('userId', '==', ctx.userId)
        .where('courseId', '==', input.courseId)
        .get();

      if (enrollSnap.empty) {
        throw new Error('Not enrolled in this course');
      }

      const enrollDoc = enrollSnap.docs[0];
      const enrollData = enrollDoc.data();

      // Get course with modules and lessons
      const courseDoc = await collections.courses.doc(input.courseId).get();
      if (!courseDoc.exists) throw new Error('Course not found');

      const courseData = courseDoc.data();

      // Get modules for this course
      const modulesSnap = await collections.modules
        .where('courseId', '==', input.courseId)
        .orderBy('sortOrder', 'asc')
        .get();

      const modules = [];
      const allLessonIds = [];
      for (const modDoc of modulesSnap.docs) {
        const modData = modDoc.data();

        // Get lessons for this module
        const lessonsSnap = await collections.lessons
          .where('moduleId', '==', modDoc.id)
          .get();

        const lessons = lessonsSnap.docs.map(doc => {
          allLessonIds.push(doc.id);
          return { id: doc.id, ...doc.data() };
        });
        modules.push({ id: modDoc.id, ...modData, lessons });
      }

      // Get lesson progress for all lessons in this course
      const progressSnap = await collections.lmsLessonProgress
        .where('userId', '==', ctx.userId)
        .where('lessonId', 'in', allLessonIds)
        .get();

      const lessonProgress = progressSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return {
        enrollment: { id: enrollDoc.id, ...enrollData, course: { id: courseDoc.id, ...courseData, modules } },
        lessonProgress,
      };
    }),

  // Update last accessed lesson (for "continue where you left off")
  updateLastAccessed: protectedProcedure
    .input(z.object({ courseId: z.string(), lessonId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Find enrollment
      const enrollSnap = await collections.lmsEnrollments
        .where('userId', '==', ctx.userId)
        .where('courseId', '==', input.courseId)
        .get();

      if (enrollSnap.empty) {
        throw new Error('Not enrolled in this course');
      }

      const enrollDoc = enrollSnap.docs[0];
      await enrollDoc.ref.update({
        lastAccessedAt: Timestamp.now(),
        lastLessonId: input.lessonId,
        updatedAt: Timestamp.now(),
      });

      return { id: enrollDoc.id, ...enrollDoc.data() };
    }),

  // Admin: enroll a user in a course
  adminEnroll: adminProcedure
    .input(z.object({ userId: z.string(), courseId: z.string() }))
    .mutation(async ({ input }) => {
      // Check if enrollment exists
      const existingSnap = await collections.lmsEnrollments
        .where('userId', '==', input.userId)
        .where('courseId', '==', input.courseId)
        .get();

      if (!existingSnap.empty) {
        // Already enrolled, return existing
        const doc = existingSnap.docs[0];
        return { id: doc.id, ...doc.data() };
      }

      // Create new enrollment
      const docRef = await collections.lmsEnrollments.add({
        userId: input.userId,
        courseId: input.courseId,
        progress: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      const newDoc = await docRef.get();
      return { id: newDoc.id, ...newDoc.data() };
    }),

  // Admin: unenroll a user
  adminUnenroll: adminProcedure
    .input(z.object({ userId: z.string(), courseId: z.string() }))
    .mutation(async ({ input }) => {
      const enrollSnap = await collections.lmsEnrollments
        .where('userId', '==', input.userId)
        .where('courseId', '==', input.courseId)
        .get();

      if (enrollSnap.empty) {
        throw new Error('Enrollment not found');
      }

      await enrollSnap.docs[0].ref.delete();
      return { success: true };
    }),
});

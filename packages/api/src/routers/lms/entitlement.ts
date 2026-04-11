import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../../trpc';
import { db, collections } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

export const lmsEntitlementRouter = router({
  // Get current user's active entitlements
  getMyEntitlements: protectedProcedure.query(async ({ ctx }) => {
    const entitlementSnapshot = await collections.lmsUserEntitlements
      .where('userId', '==', ctx.userId)
      .where('isActive', '==', true)
      .get();

    const entitlements = [];
    for (const doc of entitlementSnapshot.docs) {
      const entitlement = { id: doc.id, ...doc.data() };

      // Fetch product details
      const productSnapshot = await collections.lmsProducts.doc(entitlement.productId).get();
      const product = { id: productSnapshot.id, ...productSnapshot.data() };

      // Fetch course access
      const courseAccessSnapshot = await collections.lmsProductCourseAccess
        .where('productId', '==', entitlement.productId)
        .get();

      const courseAccess = courseAccessSnapshot.docs.map(caDoc => ({
        id: caDoc.id,
        ...caDoc.data(),
      }));

      // Fetch cert access
      const certAccessSnapshot = await collections.lmsProductCertAccess
        .where('productId', '==', entitlement.productId)
        .get();

      const certAccess = certAccessSnapshot.docs.map(caDoc => ({
        id: caDoc.id,
        ...caDoc.data(),
      }));

      // Fetch roadmap access
      const roadmapAccessSnapshot = await collections.lmsProductRoadmapAccess
        .where('productId', '==', entitlement.productId)
        .get();

      const roadmapAccess = roadmapAccessSnapshot.docs.map(raDoc => ({
        id: raDoc.id,
        ...raDoc.data(),
      }));

      entitlements.push({
        ...entitlement,
        product: {
          ...product,
          courseAccess,
          certAccess,
          roadmapAccess,
        },
      });
    }

    return entitlements;
  }),

  // Admin: create a product
  adminCreateProduct: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const docRef = await collections.lmsProducts.add({
        ...input,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    }),

  // Admin: map product to course access
  adminMapCourseAccess: adminProcedure
    .input(z.object({ productId: z.string(), courseId: z.string() }))
    .mutation(async ({ input }) => {
      const docRef = await collections.lmsProductCourseAccess.add({
        ...input,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    }),

  // Admin: grant entitlement to user
  adminGrantEntitlement: adminProcedure
    .input(z.object({
      userId: z.string(),
      productId: z.string(),
      source: z.enum(['MANUAL', 'SHOPIFY', 'SAMCART', 'STRIPE', 'KAJABI', 'THRIVECART', 'ZAPIER', 'MAKE', 'API']).default('MANUAL'),
      sourceRef: z.string().optional(),
      expiresAt: z.date().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.runTransaction(async (transaction) => {
        // Check if entitlement exists
        const entitlementQuery = await collections.lmsUserEntitlements
          .where('userId', '==', input.userId)
          .where('productId', '==', input.productId)
          .get();

        let entitlementDocRef;
        const entitlementData = {
          ...input,
          isActive: true,
          updatedAt: Timestamp.now(),
        };

        if (!entitlementQuery.empty) {
          entitlementDocRef = entitlementQuery.docs[0].ref;
          transaction.update(entitlementDocRef, entitlementData);
        } else {
          entitlementDocRef = collections.lmsUserEntitlements.doc();
          transaction.set(entitlementDocRef, {
            ...entitlementData,
            createdAt: Timestamp.now(),
          });
        }

        // Auto-enroll in linked courses
        const productCourseAccess = await collections.lmsProductCourseAccess
          .where('productId', '==', input.productId)
          .get();

        for (const doc of productCourseAccess.docs) {
          const access = doc.data();
          const enrollmentQuery = await collections.lmsEnrollments
            .where('userId', '==', input.userId)
            .where('courseId', '==', access.courseId)
            .get();

          if (enrollmentQuery.empty) {
            const enrollmentRef = collections.lmsEnrollments.doc();
            transaction.set(enrollmentRef, {
              userId: input.userId,
              courseId: access.courseId,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            });
          }
        }

        // Auto-assign linked roadmaps
        const productRoadmapAccess = await collections.lmsProductRoadmapAccess
          .where('productId', '==', input.productId)
          .get();

        for (const doc of productRoadmapAccess.docs) {
          const access = doc.data();
          const progressQuery = await collections.lmsUserRoadmapProgress
            .where('userId', '==', input.userId)
            .where('roadmapId', '==', access.roadmapId)
            .get();

          if (progressQuery.empty) {
            const progressRef = collections.lmsUserRoadmapProgress.doc();
            transaction.set(progressRef, {
              userId: input.userId,
              roadmapId: access.roadmapId,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            });
          }
        }

        // Auto-create cert candidacies
        const productCertAccess = await collections.lmsProductCertAccess
          .where('productId', '==', input.productId)
          .get();

        for (const doc of productCertAccess.docs) {
          const access = doc.data();
          const candidacyQuery = await collections.lmsCertCandidacies
            .where('userId', '==', input.userId)
            .where('certificationId', '==', access.certificationId)
            .get();

          if (candidacyQuery.empty) {
            const candidacyRef = collections.lmsCertCandidacies.doc();
            transaction.set(candidacyRef, {
              userId: input.userId,
              certificationId: access.certificationId,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            });
          }
        }

        const entitlementDoc = await entitlementDocRef.get();
        return { id: entitlementDoc.id, ...entitlementDoc.data() };
      });
    }),

  // Admin: revoke entitlement
  adminRevokeEntitlement: adminProcedure
    .input(z.object({ userId: z.string(), productId: z.string() }))
    .mutation(async ({ input }) => {
      const entitlementQuery = await collections.lmsUserEntitlements
        .where('userId', '==', input.userId)
        .where('productId', '==', input.productId)
        .get();

      if (!entitlementQuery.empty) {
        await entitlementQuery.docs[0].ref.update({ isActive: false, updatedAt: Timestamp.now() });
        const doc = await entitlementQuery.docs[0].ref.get();
        return { id: doc.id, ...doc.data() };
      }

      throw new Error('Entitlement not found');
    }),
});

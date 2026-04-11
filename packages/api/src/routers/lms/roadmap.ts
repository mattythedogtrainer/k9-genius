import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../../trpc';
import { db, collections } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

export const lmsRoadmapRouter = router({
  // Get user's assigned roadmaps with progress
  getMyRoadmaps: protectedProcedure.query(async ({ ctx }) => {
    const userProgressSnap = await collections.lmsUserRoadmapProgress
      .where('userId', '==', ctx.userId)
      .orderBy('startedAt', 'desc')
      .get();

    const roadmaps = [];
    for (const progressDoc of userProgressSnap.docs) {
      const progressData = progressDoc.data();

      // Get roadmap
      const roadmapDoc = await collections.lmsRoadmaps.doc(progressData.roadmapId).get();
      if (!roadmapDoc.exists) continue;

      const roadmapData = roadmapDoc.data();

      // Get steps
      const stepsSnap = await collections.lmsRoadmapSteps
        .where('roadmapId', '==', progressData.roadmapId)
        .orderBy('sortOrder', 'asc')
        .get();

      const steps = stepsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get step progress
      const stepProgressSnap = await collections.lmsUserRoadmapStepProgress
        .where('userRoadmapProgressId', '==', progressDoc.id)
        .get();

      const stepProgress = stepProgressSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      roadmaps.push({
        id: progressDoc.id,
        ...progressData,
        roadmap: { id: roadmapDoc.id, ...roadmapData, steps },
        stepProgress,
      });
    }

    return roadmaps;
  }),

  // Get single roadmap with detailed step progress
  getRoadmapDetail: protectedProcedure
    .input(z.object({ roadmapId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userProgressSnap = await collections.lmsUserRoadmapProgress
        .where('userId', '==', ctx.userId)
        .where('roadmapId', '==', input.roadmapId)
        .get();

      if (userProgressSnap.empty) throw new Error('Roadmap not assigned');

      const progressDoc = userProgressSnap.docs[0];
      const progressData = progressDoc.data();

      // Get roadmap
      const roadmapDoc = await collections.lmsRoadmaps.doc(input.roadmapId).get();
      if (!roadmapDoc.exists) throw new Error('Roadmap not found');

      const roadmapData = roadmapDoc.data();

      // Get steps
      const stepsSnap = await collections.lmsRoadmapSteps
        .where('roadmapId', '==', input.roadmapId)
        .orderBy('sortOrder', 'asc')
        .get();

      const steps = stepsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get step progress
      const stepProgressSnap = await collections.lmsUserRoadmapStepProgress
        .where('userRoadmapProgressId', '==', progressDoc.id)
        .get();

      const stepProgress = stepProgressSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return {
        id: progressDoc.id,
        ...progressData,
        roadmap: { id: roadmapDoc.id, ...roadmapData, steps },
        stepProgress,
      };
    }),

  // Admin: create roadmap
  adminCreate: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      thumbnailUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const docRef = await collections.lmsRoadmaps.add({
        ...input,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      const newDoc = await docRef.get();
      return { id: newDoc.id, ...newDoc.data() };
    }),

  // Admin: add step to roadmap
  adminAddStep: adminProcedure
    .input(z.object({
      roadmapId: z.string(),
      title: z.string().min(1),
      description: z.string().optional(),
      stepType: z.enum(['COURSE', 'MODULE', 'LESSON', 'QUIZ', 'RESOURCE', 'CERTIFICATION', 'MILESTONE', 'EXTERNAL_LINK']),
      referenceId: z.string().optional(),
      isMilestone: z.boolean().default(false),
      isRequired: z.boolean().default(true),
      prerequisiteStepIds: z.array(z.string()).default([]),
    }))
    .mutation(async ({ input }) => {
      const { roadmapId, ...data } = input;

      // Get max sortOrder
      const stepsSnap = await collections.lmsRoadmapSteps
        .where('roadmapId', '==', roadmapId)
        .get();

      let maxSort = 0;
      stepsSnap.docs.forEach(doc => {
        const docSort = doc.data().sortOrder ?? 0;
        if (docSort > maxSort) maxSort = docSort;
      });

      const docRef = await collections.lmsRoadmapSteps.add({
        ...data,
        roadmapId,
        sortOrder: maxSort + 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      const newDoc = await docRef.get();
      return { id: newDoc.id, ...newDoc.data() };
    }),

  // Admin: assign roadmap to user
  adminAssign: adminProcedure
    .input(z.object({ userId: z.string(), roadmapId: z.string() }))
    .mutation(async ({ input }) => {
      // Get roadmap and its steps
      const roadmapDoc = await collections.lmsRoadmaps.doc(input.roadmapId).get();
      if (!roadmapDoc.exists) throw new Error('Roadmap not found');

      const stepsSnap = await collections.lmsRoadmapSteps
        .where('roadmapId', '==', input.roadmapId)
        .orderBy('sortOrder', 'asc')
        .get();

      const steps = stepsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Create user roadmap progress
      const userProgressRef = await collections.lmsUserRoadmapProgress.add({
        userId: input.userId,
        roadmapId: input.roadmapId,
        startedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      const userProgressDoc = await userProgressRef.get();

      // Create step progress entries using batch
      const batch = db.batch();
      steps.forEach((step, index) => {
        const stepProgressRef = collections.lmsUserRoadmapStepProgress.doc();
        batch.set(stepProgressRef, {
          userRoadmapProgressId: userProgressDoc.id,
          stepId: step.id,
          isUnlocked: index === 0 || (step.prerequisiteStepIds?.length ?? 0) === 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      });

      await batch.commit();

      return { id: userProgressDoc.id, ...userProgressDoc.data() };
    }),
});

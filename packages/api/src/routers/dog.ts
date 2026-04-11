import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { collections } from '@k9-genius/db';
import type { Dog } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

export const dogRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // Find user first
    const userSnap = await collections.users
      .where('firebaseUid', '==', ctx.userId)
      .limit(1)
      .get();

    if (userSnap.empty) return [];

    const userId = userSnap.docs[0].id;
    const snapshot = await collections.dogs
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dog));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const doc = await collections.dogs.doc(input.id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as Dog;
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      breed: z.string().optional(),
      age: z.number().int().min(0).max(30).optional(),
      weight: z.number().min(0).max(200).optional(),
      temperament: z.string().optional(),
      trainingGoals: z.array(z.string()).default([]),
      experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
    }))
    .mutation(async ({ ctx, input }) => {
      const userSnap = await collections.users
        .where('firebaseUid', '==', ctx.userId)
        .limit(1)
        .get();

      if (userSnap.empty) throw new Error('User not found');

      const now = Timestamp.now();
      const docRef = await collections.dogs.add({
        ...input,
        userId: userSnap.docs[0].id,
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        leaderboardTier: 'PUP',
        createdAt: now,
        updatedAt: now,
      });

      const newDoc = await docRef.get();
      return { id: newDoc.id, ...newDoc.data() } as Dog;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(100).optional(),
      breed: z.string().optional(),
      age: z.number().int().min(0).max(30).optional(),
      weight: z.number().min(0).max(200).optional(),
      temperament: z.string().optional(),
      trainingGoals: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await collections.dogs.doc(id).update({ ...data, updatedAt: Timestamp.now() });
      const updated = await collections.dogs.doc(id).get();
      return { id: updated.id, ...updated.data() } as Dog;
    }),
});

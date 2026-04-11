import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../trpc';
import { collections } from '@k9-genius/db';
import type { User } from '@k9-genius/db';

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    // Find user by Firebase UID
    const snapshot = await collections.users
      .where('firebaseUid', '==', ctx.userId)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const doc = await collections.users.doc(input.id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as User;
    }),

  list: adminProcedure
    .input(z.object({
      limit: z.number().default(25),
      role: z.enum(['CONSUMER', 'TRAINER', 'ADMIN']).optional(),
    }))
    .query(async ({ input }) => {
      let query = collections.users.orderBy('createdAt', 'desc').limit(input.limit);

      if (input.role) {
        query = collections.users.where('role', '==', input.role).orderBy('createdAt', 'desc').limit(input.limit);
      }

      const snapshot = await query.get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      return { users, total: users.length };
    }),

  update: protectedProcedure
    .input(z.object({
      displayName: z.string().optional(),
      bio: z.string().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      avatarUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const snapshot = await collections.users
        .where('firebaseUid', '==', ctx.userId)
        .limit(1)
        .get();

      if (snapshot.empty) throw new Error('User not found');

      const userDoc = snapshot.docs[0];
      await userDoc.ref.update({ ...input, updatedAt: new Date() });

      const updated = await userDoc.ref.get();
      return { id: updated.id, ...updated.data() } as User;
    }),
});

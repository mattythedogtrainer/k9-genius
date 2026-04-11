import { z } from 'zod';
import { router, publicProcedure, protectedProcedure, trainerProcedure } from '../trpc';
import { collections } from '@k9-genius/db';
import type { Course } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

export const courseRouter = router({
  list: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']).optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      let query = collections.courses
        .where('status', '==', 'PUBLISHED')
        .orderBy('createdAt', 'desc')
        .limit(input.limit);

      if (input.category) {
        query = collections.courses
          .where('status', '==', 'PUBLISHED')
          .where('category', '==', input.category)
          .orderBy('createdAt', 'desc')
          .limit(input.limit);
      }

      const snapshot = await query.get();
      const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      return { courses, total: courses.length };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const doc = await collections.courses.doc(input.id).get();
      if (!doc.exists) return null;

      // Get modules for this course
      const modulesSnap = await collections.modules
        .where('courseId', '==', input.id)
        .orderBy('sortOrder', 'asc')
        .get();

      const modules = await Promise.all(
        modulesSnap.docs.map(async (modDoc) => {
          const lessonsSnap = await collections.lessons
            .where('moduleId', '==', modDoc.id)
            .orderBy('sortOrder', 'asc')
            .get();

          return {
            id: modDoc.id,
            ...modDoc.data(),
            lessons: lessonsSnap.docs.map(l => ({ id: l.id, ...l.data() })),
          };
        })
      );

      return {
        id: doc.id,
        ...doc.data(),
        modules,
      };
    }),

  create: trainerProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      description: z.string().optional(),
      category: z.string().optional(),
      difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']).default('BEGINNER'),
      price: z.number().min(0).default(0),
      isProblemCourse: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      // Find the trainer's user doc
      const userSnap = await collections.users
        .where('firebaseUid', '==', ctx.userId)
        .limit(1)
        .get();

      const trainerId = userSnap.empty ? null : userSnap.docs[0].id;
      const now = Timestamp.now();

      const docRef = await collections.courses.add({
        ...input,
        trainerId,
        status: 'DRAFT',
        studentCount: 0,
        createdAt: now,
        updatedAt: now,
      });

      const newDoc = await docRef.get();
      return { id: newDoc.id, ...newDoc.data() } as Course;
    }),
});

import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc';
import { db, collections } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

export const lmsLessonRouter = router({
  // Get lesson content (with access check via enrollment)
  getLesson: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      const lessonDoc = await collections.lessons.doc(input.lessonId).get();
      if (!lessonDoc.exists) throw new Error('Lesson not found');

      const lessonData = lessonDoc.data();

      // Get module
      const moduleDoc = await collections.modules.doc(lessonData.moduleId).get();
      if (!moduleDoc.exists) throw new Error('Module not found');

      const moduleData = moduleDoc.data();

      // Get course
      const courseDoc = await collections.courses.doc(moduleData.courseId).get();
      if (!courseDoc.exists) throw new Error('Course not found');

      const courseData = courseDoc.data();

      // Verify enrollment
      const enrollSnap = await collections.lmsEnrollments
        .where('userId', '==', ctx.userId)
        .where('courseId', '==', moduleData.courseId)
        .get();

      if (enrollSnap.empty) throw new Error('Not enrolled in this course');

      // Get all lessons in this module
      const lessonsSnap = await collections.lessons
        .where('moduleId', '==', lessonData.moduleId)
        .orderBy('sortOrder', 'asc')
        .get();

      const moduleLessons = lessonsSnap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        sortOrder: doc.data().sortOrder,
      }));

      // Get quiz if associated
      const quizSnap = await collections.lmsQuizzes
        .where('lessonId', '==', input.lessonId)
        .get();

      let quiz = null;
      if (!quizSnap.empty) {
        const quizDoc = quizSnap.docs[0];
        quiz = {
          id: quizDoc.id,
          title: quizDoc.data().title,
          isRequired: quizDoc.data().isRequired,
          passingScore: quizDoc.data().passingScore,
        };
      }

      // Get resources
      const resourcesSnap = await collections.lmsLessonResources
        .where('lessonId', '==', input.lessonId)
        .get();

      const resources = [];
      for (const resDoc of resourcesSnap.docs) {
        const resData = resDoc.data();
        const resourceDoc = await collections.lmsResources.doc(resData.resourceId).get();
        if (resourceDoc.exists) {
          resources.push({
            id: resDoc.id,
            ...resData,
            resource: { id: resourceDoc.id, ...resourceDoc.data() },
          });
        }
      }

      // Get progress
      const progressSnap = await collections.lmsLessonProgress
        .where('userId', '==', ctx.userId)
        .where('lessonId', '==', input.lessonId)
        .get();

      const progress = progressSnap.empty ? null : { id: progressSnap.docs[0].id, ...progressSnap.docs[0].data() };

      return {
        lesson: {
          id: lessonDoc.id,
          ...lessonData,
          module: {
            id: moduleDoc.id,
            ...moduleData,
            course: { id: courseDoc.id, ...courseData },
            lessons: moduleLessons,
          },
          lmsQuiz: quiz,
          lmsLessonResources: resources,
        },
        progress,
      };
    }),

  // Mark lesson as complete
  markComplete: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get lesson to find course
      const lessonDoc = await collections.lessons.doc(input.lessonId).get();
      if (!lessonDoc.exists) throw new Error('Lesson not found');

      const lessonData = lessonDoc.data();

      // Get module
      const moduleDoc = await collections.modules.doc(lessonData.moduleId).get();
      if (!moduleDoc.exists) throw new Error('Module not found');

      const moduleData = moduleDoc.data();
      const courseId = moduleData.courseId;

      // Upsert lesson progress
      const progressSnap = await collections.lmsLessonProgress
        .where('userId', '==', ctx.userId)
        .where('lessonId', '==', input.lessonId)
        .get();

      let progressDoc;
      if (progressSnap.empty) {
        const docRef = await collections.lmsLessonProgress.add({
          userId: ctx.userId,
          lessonId: input.lessonId,
          isCompleted: true,
          completedAt: Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        progressDoc = await docRef.get();
      } else {
        progressDoc = progressSnap.docs[0];
        await progressDoc.ref.update({
          isCompleted: true,
          completedAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }

      // Recalculate course progress
      // Get all lessons for this course
      const modulesSnap = await collections.modules.where('courseId', '==', courseId).get();
      const allLessonIds = [];

      for (const mod of modulesSnap.docs) {
        const lessonsSnap = await collections.lessons.where('moduleId', '==', mod.id).get();
        lessonsSnap.docs.forEach(l => allLessonIds.push(l.id));
      }

      // Count completed lessons
      const completedSnap = await collections.lmsLessonProgress
        .where('userId', '==', ctx.userId)
        .where('lessonId', 'in', allLessonIds)
        .where('isCompleted', '==', true)
        .get();

      const completedCount = completedSnap.size;
      const newProgress = allLessonIds.length > 0 ? completedCount / allLessonIds.length : 0;

      // Update enrollment
      const enrollSnap = await collections.lmsEnrollments
        .where('userId', '==', ctx.userId)
        .where('courseId', '==', courseId)
        .get();

      if (!enrollSnap.empty) {
        await enrollSnap.docs[0].ref.update({
          progress: newProgress,
          completedAt: newProgress >= 1 ? Timestamp.now() : null,
          updatedAt: Timestamp.now(),
        });
      }

      return { id: progressDoc.id, ...progressDoc.data() };
    }),

  // Update video watch progress
  updateVideoProgress: protectedProcedure
    .input(z.object({
      lessonId: z.string(),
      watchedPct: z.number().min(0).max(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const progressSnap = await collections.lmsLessonProgress
        .where('userId', '==', ctx.userId)
        .where('lessonId', '==', input.lessonId)
        .get();

      let progressDoc;
      if (progressSnap.empty) {
        const docRef = await collections.lmsLessonProgress.add({
          userId: ctx.userId,
          lessonId: input.lessonId,
          videoWatchedPct: input.watchedPct,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        progressDoc = await docRef.get();
      } else {
        progressDoc = progressSnap.docs[0];
        await progressDoc.ref.update({
          videoWatchedPct: input.watchedPct,
          updatedAt: Timestamp.now(),
        });
      }

      return { id: progressDoc.id, ...progressDoc.data() };
    }),
});

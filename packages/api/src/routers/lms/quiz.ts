import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../../trpc';
import { db, collections } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

export const lmsQuizRouter = router({
  // Get quiz for a lesson (student-facing)
  getQuiz: protectedProcedure
    .input(z.object({ quizId: z.string() }))
    .query(async ({ ctx, input }) => {
      const quizDoc = await collections.lmsQuizzes.doc(input.quizId).get();
      if (!quizDoc.exists) throw new Error('Quiz not found');

      const quizData = quizDoc.data();

      // Get questions
      const questionsSnap = await collections.lmsQuizQuestions
        .where('quizId', '==', input.quizId)
        .orderBy('sortOrder', 'asc')
        .get();

      const questions = questionsSnap.docs.map(doc => {
        const q = doc.data();
        return {
          id: doc.id,
          type: q.type,
          questionText: q.questionText,
          questionMedia: q.questionMedia,
          options: q.options,
          matchingPairs: q.matchingPairs,
          orderingItems: q.orderingItems,
          points: q.points,
          sortOrder: q.sortOrder,
          // NOTE: correctAnswer and explanation NOT returned until after attempt
        };
      });

      const quiz = {
        id: quizDoc.id,
        ...quizData,
        questions,
      };

      // Get previous attempts
      const attemptsSnap = await collections.lmsQuizAttempts
        .where('userId', '==', ctx.userId)
        .where('quizId', '==', input.quizId)
        .orderBy('startedAt', 'desc')
        .get();

      const attempts = attemptsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const canAttempt = !quiz.maxAttempts || attempts.length < quiz.maxAttempts;

      // Check cooldown
      let cooldownUntil: Date | null = null;
      if (quiz.cooldownMinutes && attempts.length > 0) {
        const lastAttempt = attempts[0];
        if (lastAttempt.completedAt) {
          const completedTime = lastAttempt.completedAt.toDate ? lastAttempt.completedAt.toDate() : lastAttempt.completedAt;
          const cooldownEnd = new Date(completedTime.getTime() + quiz.cooldownMinutes * 60000);
          if (cooldownEnd > new Date()) {
            cooldownUntil = cooldownEnd;
          }
        }
      }

      return {
        quiz,
        attemptCount: attempts.length,
        bestScore: attempts.length > 0 ? Math.max(...attempts.map(a => a.score ?? 0)) : null,
        lastAttempt: attempts[0] ?? null,
        canAttempt,
        cooldownUntil,
      };
    }),

  // Start a quiz attempt
  startAttempt: protectedProcedure
    .input(z.object({ quizId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingSnap = await collections.lmsQuizAttempts
        .where('userId', '==', ctx.userId)
        .where('quizId', '==', input.quizId)
        .get();

      const attemptNumber = existingSnap.size + 1;

      const docRef = await collections.lmsQuizAttempts.add({
        userId: ctx.userId,
        quizId: input.quizId,
        attemptNumber,
        answers: [],
        startedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      const newDoc = await docRef.get();
      return { id: newDoc.id, ...newDoc.data() };
    }),

  // Submit quiz attempt with answers
  submitAttempt: protectedProcedure
    .input(z.object({
      attemptId: z.string(),
      answers: z.array(z.object({
        questionId: z.string(),
        selectedOptionIds: z.array(z.string()).optional(),
        textAnswer: z.string().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const attemptDoc = await collections.lmsQuizAttempts.doc(input.attemptId).get();
      if (!attemptDoc.exists) throw new Error('Attempt not found');

      const attemptData = attemptDoc.data();
      if (attemptData.userId !== ctx.userId) throw new Error('Unauthorized');
      if (attemptData.completedAt) throw new Error('Attempt already submitted');

      // Get quiz and questions
      const quizDoc = await collections.lmsQuizzes.doc(attemptData.quizId).get();
      if (!quizDoc.exists) throw new Error('Quiz not found');

      const quizData = quizDoc.data();

      const questionsSnap = await collections.lmsQuizQuestions
        .where('quizId', '==', attemptData.quizId)
        .get();

      const questionsMap = new Map();
      questionsSnap.docs.forEach(doc => {
        questionsMap.set(doc.id, doc.data());
      });

      // Score the quiz
      let totalPoints = 0;
      let earnedPoints = 0;
      const gradedAnswers = input.answers.map(answer => {
        const question = questionsMap.get(answer.questionId);
        if (!question) return { ...answer, isCorrect: false, pointsEarned: 0 };

        totalPoints += question.points;
        let isCorrect = false;

        if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
          const options = question.options as Array<{ id: string; isCorrect: boolean }>;
          const correctOption = options?.find(o => o.isCorrect);
          isCorrect = answer.selectedOptionIds?.[0] === correctOption?.id;
        } else if (question.type === 'MULTI_SELECT') {
          const options = question.options as Array<{ id: string; isCorrect: boolean }>;
          const correctIds = options?.filter(o => o.isCorrect).map(o => o.id) ?? [];
          const selected = answer.selectedOptionIds ?? [];
          isCorrect = correctIds.length === selected.length && correctIds.every(id => selected.includes(id));
        } else if (question.type === 'SHORT_ANSWER') {
          isCorrect = answer.textAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
        }

        const pointsEarned = isCorrect ? question.points : 0;
        earnedPoints += pointsEarned;

        return {
          ...answer,
          isCorrect,
          pointsEarned,
          explanation: question.explanation,
        };
      });

      const score = totalPoints > 0 ? earnedPoints / totalPoints : 0;
      const passed = score >= quizData.passingScore;

      const startedAt = attemptData.startedAt.toDate ? attemptData.startedAt.toDate() : attemptData.startedAt;
      const timeSpentSec = Math.floor((new Date().getTime() - startedAt.getTime()) / 1000);

      await attemptDoc.ref.update({
        answers: gradedAnswers,
        score,
        passed,
        completedAt: Timestamp.now(),
        timeSpentSec,
        updatedAt: Timestamp.now(),
      });

      const updated = await attemptDoc.ref.get();
      return { id: updated.id, ...updated.data() };
    }),

  // Admin: create a quiz
  adminCreate: adminProcedure
    .input(z.object({
      lessonId: z.string().optional(),
      certificationId: z.string().optional(),
      title: z.string().min(1),
      description: z.string().optional(),
      passingScore: z.number().min(0).max(1).default(0.7),
      maxAttempts: z.number().optional(),
      cooldownMinutes: z.number().optional(),
      timeLimitMinutes: z.number().optional(),
      isRequired: z.boolean().default(false),
      shuffleQuestions: z.boolean().default(false),
      showFeedback: z.enum(['AFTER_EACH', 'AFTER_SUBMIT', 'NONE']).default('AFTER_EACH'),
    }))
    .mutation(async ({ input }) => {
      const docRef = await collections.lmsQuizzes.add({
        ...input,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      const newDoc = await docRef.get();
      return { id: newDoc.id, ...newDoc.data() };
    }),

  // Admin: add question to quiz
  adminAddQuestion: adminProcedure
    .input(z.object({
      quizId: z.string(),
      type: z.enum(['MULTIPLE_CHOICE', 'MULTI_SELECT', 'TRUE_FALSE', 'SHORT_ANSWER', 'MATCHING', 'ORDERING']),
      questionText: z.string().min(1),
      options: z.any().optional(),
      correctAnswer: z.string().optional(),
      matchingPairs: z.any().optional(),
      orderingItems: z.any().optional(),
      explanation: z.string().optional(),
      points: z.number().default(1),
    }))
    .mutation(async ({ input }) => {
      const { quizId, ...data } = input;

      // Get max sortOrder
      const questionsSnap = await collections.lmsQuizQuestions
        .where('quizId', '==', quizId)
        .get();

      let maxSort = 0;
      questionsSnap.docs.forEach(doc => {
        const docSort = doc.data().sortOrder ?? 0;
        if (docSort > maxSort) maxSort = docSort;
      });

      const docRef = await collections.lmsQuizQuestions.add({
        ...data,
        quizId,
        sortOrder: maxSort + 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      const newDoc = await docRef.get();
      return { id: newDoc.id, ...newDoc.data() };
    }),
});

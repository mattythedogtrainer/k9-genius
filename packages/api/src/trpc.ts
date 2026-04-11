import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';

export type Context = {
  userId: string | null;
  userRole: string | null;
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new Error('Not authenticated');
  }
  return next({
    ctx: {
      userId: ctx.userId,
      userRole: ctx.userRole,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

const isAdmin = t.middleware(({ ctx, next }) => {
  if (ctx.userRole !== 'ADMIN') {
    throw new Error('Not authorized - admin only');
  }
  return next({ ctx });
});

export const adminProcedure = t.procedure.use(isAuthed).use(isAdmin);

const isTrainer = t.middleware(({ ctx, next }) => {
  if (ctx.userRole !== 'TRAINER' && ctx.userRole !== 'ADMIN') {
    throw new Error('Not authorized - trainer only');
  }
  return next({ ctx });
});

export const trainerProcedure = t.procedure.use(isAuthed).use(isTrainer);

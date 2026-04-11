import { router } from './trpc';
import { userRouter } from './routers/user';
import { courseRouter } from './routers/course';
import { dogRouter } from './routers/dog';
import { lmsRouter } from './routers/lms';

export const appRouter = router({
  user: userRouter,
  course: courseRouter,
  dog: dogRouter,
  lms: lmsRouter,
});

export type AppRouter = typeof appRouter;

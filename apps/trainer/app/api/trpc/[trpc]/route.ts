import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@k9-genius/api';
import { auth, db } from '@k9-genius/db';
import type { Context } from '@k9-genius/api';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async (): Promise<Context> => {
      try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
          return {
            userId: null,
            userRole: null,
          };
        }

        const decodedToken = await auth.verifyIdToken(token);
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        const userData = userDoc.data();

        return {
          userId: decodedToken.uid,
          userRole: userData?.role || null,
        };
      } catch (error) {
        return {
          userId: null,
          userRole: null,
        };
      }
    },
  });

export { handler as GET, handler as POST };

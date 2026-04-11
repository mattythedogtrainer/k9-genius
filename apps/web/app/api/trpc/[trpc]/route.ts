import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@k9-genius/api';
import type { Context } from '@k9-genius/api';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: (): Context => ({
      // TODO: Extract from Clerk auth
      userId: null,
      userRole: null,
    }),
  });

export { handler as GET, handler as POST };

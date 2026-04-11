import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@k9-genius/api';

export const trpc = createTRPCReact<AppRouter>();

'use client';

import { TRPCProvider } from '@/lib/trpc-provider';
import { AuthProvider } from '@k9-genius/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TRPCProvider>{children}</TRPCProvider>
    </AuthProvider>
  );
}

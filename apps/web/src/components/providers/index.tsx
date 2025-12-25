'use client';

import { SessionProvider } from './session-provider';
import { QueryProvider } from './query-provider';
import type { Session } from 'next-auth';

interface Props {
  children: React.ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      <QueryProvider>{children}</QueryProvider>
    </SessionProvider>
  );
}

export { SessionProvider } from './session-provider';
export { QueryProvider } from './query-provider';

import type { ReactNode } from 'react';
import { DEMO_USER, UserContext } from './user-context.ts';

export function UserProvider({ children }: { children: ReactNode }) {
  return <UserContext value={DEMO_USER}>{children}</UserContext>;
}

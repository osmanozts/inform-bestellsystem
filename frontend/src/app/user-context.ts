import { createContext, useContext } from 'react';

export type DemoUser = {
  id: string;
  displayName: string;
};

export const DEMO_USER: DemoUser = {
  id: '00000000-0000-0000-0000-000000000001',
  displayName: 'Demo-Benutzer',
};

export const UserContext = createContext<DemoUser>(DEMO_USER);

export function useUser(): DemoUser {
  return useContext(UserContext);
}

import type { Session } from '@supabase/supabase-js';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AuthState {
  session: Session | undefined | null;
}

interface AuthAPI {
  api: {
    setSession(newSession: Session | null): void;
  };
}

type AuthStore = AuthState & AuthAPI;

const useAuthStore = create(
  immer<AuthStore>((set) => ({
    session: undefined,
    api: {
      setSession: (newSession) =>
        set((state) => {
          state.session = newSession;
        }),
    },
  })),
);

export const useAuthAPI = () => useAuthStore((s) => s.api);
export const useAuthSession = () => useAuthStore((s) => s.session);

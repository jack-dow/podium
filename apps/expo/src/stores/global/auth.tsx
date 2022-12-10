import type { Session, User } from '@supabase/supabase-js';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AuthState {
  session: Session | undefined | null;
  user: User | undefined | null;
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
    user: undefined,
    api: {
      setSession: (newSession) =>
        set((state) => {
          state.session = newSession;
          state.user = newSession?.user;
        }),
    },
  })),
);

/** Returns the current state of the auth store */
export const getAuthStoreState = useAuthStore.getState;
/** Returns the current user from the auth store, but if the user does not exist throws an error. */
export const getAuthSafeUser = () => {
  const user = useAuthStore.getState().user;
  if (!user) {
    throw new Error(
      '[getAuthSafeUser] Attempted to get the current user in a place where it was expected to exist, but it did not. Please fix this.',
    );
  }
  return user;
};

/** Auth hook to subscribe to the value of the auth API */
export const useAuthAPI = () => useAuthStore((s) => s.api);
/** Auth hook to subscribe to the value of the user session */
export const useAuthSession = () => useAuthStore((s) => s.session);
/** Auth hook to subscribe to the value of the user user */
export const useAuthUser = () => useAuthStore((s) => s.user);

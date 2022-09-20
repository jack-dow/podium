import type { Session } from '@supabase/supabase-js';
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { LoginScreen } from '../screens/LoginScreen';
import { supabase } from '@/lib/supabase';

interface WithAuthProps {
  session: Session;
}

export function withAuth<T>(WrappedComponent: ComponentType<T & WithAuthProps>) {
  const ComponentWithAuth = (props: T) => {
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
      let mounted = true;

      async function getInitialSession() {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // only update the react state if the component is still mounted
        if (mounted) {
          if (session) {
            setSession(session);
          }

          setIsLoading(false);
        }
      }

      getInitialSession();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => {
        mounted = false;

        subscription?.unsubscribe();
      };
    });

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!session) {
      return <LoginScreen />;
    }

    return <WrappedComponent {...props} session={session} />;
  };

  return ComponentWithAuth;
}

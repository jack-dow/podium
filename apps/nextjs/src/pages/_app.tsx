// src/pages/_app.tsx
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

import { useState } from 'react';
import type { Session } from '@supabase/auth-helpers-nextjs';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import { trpc } from '../utils/trpc';

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}

export default trpc.withTRPC(MyApp);

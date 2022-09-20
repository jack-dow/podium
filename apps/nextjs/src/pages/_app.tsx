// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import { Toaster } from 'react-hot-toast';

import { trpc } from '../utils/trpc';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </>
  );
};

export default trpc.withTRPC(MyApp);

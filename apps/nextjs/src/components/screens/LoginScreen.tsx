import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/inputs/Input';
import { Button } from '@/components/buttons/Button';
import { Anchor } from '@/components/navigation/Anchor';
import { Label } from '@/components/inputs/Label';

interface FormValues {
  email: string;
  password: string;
}

export const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit = handleSubmit(async ({ email, password }) => {
    setIsLoading(true);

    const { session, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      return setError(error.message);
    }

    if (session) {
      router.push('/');
    }
  });
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/2 ml-[-47.5rem] w-[122.5rem] max-w-none">
        <Image src="/beams-cover@95.jpeg" alt="" width={3920} height={1296} priority layout="responsive" />
      </div>
      <div className="absolute inset-0 text-slate-900/[0.07] [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid-bg"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
              x="100%"
              patternTransform="translate(0 -1)"
            >
              <path d="M0 32V.5H32" fill="none" stroke="currentColor"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-bg)"></rect>
        </svg>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center pt-12 pb-16">
        <div className="mb-6 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 mb-4 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account? <Anchor href="/register">Register now</Anchor>
          </p>
        </div>
        {error && (
          <p className="mb-6 text-center text-xs font-medium text-red-600">
            {error === 'Invalid login credentials' ? 'These credentials do not match our records.' : error}
          </p>
        )}
        <form className="mb-12 w-full max-w-sm space-y-6" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email-address">Email address</Label>
            <Input
              id="email-address"
              type="email"
              invalid={!!error}
              required
              autoComplete="email"
              {...register('email')}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              invalid={!!error}
              required
              autoComplete="password"
              {...register('password')}
            />
          </div>
          <Button type="submit" loading={isLoading} fullWidth color="slate">
            {isLoading ? 'Logging you in...' : 'Sign in to your account'}
          </Button>
        </form>
      </div>
    </main>
  );
};

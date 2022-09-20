import type { NextPage } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { Input } from '@/components/inputs/Input';
import { Button } from '@/components/buttons/Button';
import { Anchor } from '@/components/navigation/Anchor';
import { supabase } from '@/lib/supabase';
import { trpc } from '@/utils/trpc';
import { Label } from '@/components/inputs/Label';

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const Register: NextPage = () => {
  //   const router = useRouter();
  //   const createUserMutation = trpc.useMutation(['users.create']);
  const { register, handleSubmit } = useForm<FormValues>();

  //   const [isLoading, setIsLoading] = useState(false);
  //   const [error, setError] = useState<string | undefined>();

  //   const onSubmit = handleSubmit(async ({ email, password, name }) => {
  //     setIsLoading(true);

  //     try {
  //       const signUp = await supabase.auth.signUp({
  //         email,
  //         password,
  //       });

  //       if (!signUp.user || signUp.error) {
  //         throw signUp.error;
  //       }

  //       await createUserMutation.mutate({
  //         id: signUp.user.id,
  //         email,
  //         name,
  //       });

  //       if (createUserMutation.error) {
  //         throw createUserMutation.error;
  //       }

  //       router.push('/');
  //     } catch (error: any) {
  //       setError(error && error.message ? error.message : 'An unknown error occurred.');
  //     }

  //     setIsLoading(false);
  //   });

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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Have an account? <Anchor href="/login">Login instead</Anchor>
          </p>
        </div>
        {/* {error && <p className="mb-6 text-center text-xs font-medium text-red-600">{error}</p>} */}
        <form className="mb-12 w-full max-w-sm space-y-6">
          <div className="flex space-x-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" required autoComplete="first-name" {...register('name')} />
            </div>
            <div>
              <Label htmlFor="email-address">Email address</Label>
              <Input
                id="email-address"
                type="email"
                // invalid={!!error}
                // required
                autoComplete="email"
                {...register('email')}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              //   invalid={!!error}
              required
              autoComplete="password"
              {...register('password')}
            />
          </div>
          <Button type="submit" fullWidth color="slate">
            Create account
            {/* {isLoading ? 'Creating your account...' : 'Create account'} */}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Register;

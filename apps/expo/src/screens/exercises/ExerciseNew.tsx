import React, { useState } from 'react';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '@/lib/supabase';
import type { RootStackParamList } from '@/_app';
import { Layout } from '@/components/layout/Layout';
import { ExerciseEditor } from '@/components/screens/ExerciseEditor';
import { trpc } from '@/utils/trpc';
import { SafeAreaView } from '@/components/layout/SafeAreaView';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseNew'>;

export const ExerciseNewScreen = ({ navigation }: Props) => {
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const mutation = trpc.exercises.create.useMutation({
    onSuccess() {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
  });

  return (
    <SafeAreaView>
      <Layout
        title="Create Exercise"
        description="Here is where you can create the exercises that will be referenced throughout the app"
      >
        <ExerciseEditor
          error={authError || mutation.error?.message}
          isLoading={mutation.isLoading}
          onSubmit={async (data) => {
            const {
              data: { session },
              error,
            } = await supabase.auth.getSession();
            if (error) {
              setAuthError(error.message);
            }
            if (session) {
              mutation.mutate({ ...data, user: session.user.id });
            }
          }}
        />
      </Layout>
    </SafeAreaView>
  );
};

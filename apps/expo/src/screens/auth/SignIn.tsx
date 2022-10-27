import type { TextInput } from 'react-native';
import { Platform, StatusBar, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/buttons/Button';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import type { RootStackParamList } from '@/_app';
import { Anchor } from '@/components/navigation/Anchor';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from '@/components/layout/SafeAreaView';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

interface FormValues {
  email: string;
  password: string;
}

const EMAIL_REGEX =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])+)\])/;

export const SignInScreen = ({ navigation }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const { handleSubmit, control } = useForm<FormValues>();

  const passwordRef = useRef<TextInput>(null);

  const handleSignInSubmit = handleSubmit(async ({ email, password }) => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setIsLoading(false);
  });

  return (
    <SafeAreaView>
      <View className="relative h-full flex-1 overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
        <View className="relative flex flex-1 flex-col items-center justify-center pt-0 pb-16">
          <View className="mb-6 sm:mx-auto sm:w-full sm:max-w-md">
            <Text className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</Text>
            <View className="mt-4 flex-row items-center justify-center">
              <Text className="text-center text-sm text-gray-600">Don&apos;t have an account? </Text>
              <Anchor onPress={() => navigation.navigate('SignUp')}>Register now</Anchor>
            </View>
          </View>

          {error && (
            <Text className="mb-6 text-center text-xs font-medium text-red-600">
              {error === 'Invalid login credentials' ? 'These credentials do not match our records.' : error}
            </Text>
          )}

          <View className="w-full">
            <View className="mb-6">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Please fill in this field.',
                  pattern: {
                    value: EMAIL_REGEX,
                    message: 'Please enter a valid email address.',
                  },
                }}
                render={({ field: { value, onChange, onBlur }, fieldState }) => (
                  <EmailInput
                    label="Email address"
                    returnKeyType="next"
                    invalid={fieldState.error?.message}
                    value={value}
                    onBlur={onBlur}
                    blurOnSubmit={false}
                    onChangeText={(value) => onChange(value)}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                )}
              />
            </View>

            <View className="mb-6">
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Please fill in this field.' }}
                render={({ field: { value, onChange, onBlur }, fieldState }) => (
                  <PasswordInput
                    label="Password"
                    returnKeyType="go"
                    blurOnSubmit={false}
                    ref={passwordRef}
                    invalid={fieldState.error?.message}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    onSubmitEditing={handleSignInSubmit}
                  />
                )}
              />
            </View>

            <Button variant="secondary" fullWidth onPress={handleSignInSubmit} loading={isLoading}>
              {isLoading ? 'Signing you in...' : 'Sign in to your account'}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

import type { TextInput } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/buttons/Button';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import type { RootStackParamList } from '@/_app';
import { Anchor } from '@/components/navigation/Anchor';
import { Input } from '@/components/inputs/Input';
import { trpc } from '@/utils/trpc';
import { SafeAreaView } from '@/components/layout/SafeAreaView';
import type { Theme } from '@/themes';
import { useTheme } from '@/themes';
import { responsive } from '@/responsive';
import { supabase } from '@/lib/supabsae';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const EMAIL_REGEX =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])+)\])/;

export const SignUpScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const { handleSubmit, control } = useForm<FormValues>();

  const mutation = trpc.profile.create.useMutation();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleSignUpSubmit = handleSubmit(async ({ email, password, name }) => {
    setIsLoading(true);
    setError(null);
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    if (user?.id) {
      mutation.mutate({
        id: user.id,
        name,
        email,
      });
    }
    setIsLoading(false);
  });

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Create your account</Text>
            <View style={styles.subHeadingContainer}>
              <Text style={styles.subHeading}>Have an account? </Text>
              <Anchor onPress={() => navigation.navigate('SignIn')}>Login instead</Anchor>
            </View>
          </View>

          {(error || mutation.error) && (
            <Text style={styles.errorText}>{error || mutation.error?.message || 'Something went wrong!'}</Text>
          )}
          <View>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Please fill in this field.' }}
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <Input
                  label="Name"
                  returnKeyType="next"
                  invalid={fieldState.error?.message}
                  value={value}
                  onBlur={onBlur}
                  blurOnSubmit={false}
                  onChangeText={(value) => onChange(value)}
                  onSubmitEditing={() => emailRef.current?.focus()}
                  style={{ marginBottom: theme.spacing.lg }}
                />
              )}
            />

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
                  ref={emailRef}
                  invalid={fieldState.error?.message}
                  value={value}
                  onBlur={onBlur}
                  blurOnSubmit={false}
                  onChangeText={(value) => onChange(value)}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  style={{ marginBottom: theme.spacing.lg }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: 'Please fill in this field.' }}
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <PasswordInput
                  label="Password"
                  returnKeyType="next"
                  ref={passwordRef}
                  invalid={fieldState.error?.message}
                  value={value}
                  onBlur={onBlur}
                  blurOnSubmit={false}
                  onChangeText={(value) => onChange(value)}
                  onSubmitEditing={handleSignUpSubmit}
                  style={{ marginBottom: theme.spacing.lg }}
                />
              )}
            />

            <Button variant="secondary" onPress={handleSignUpSubmit} loading={isLoading || mutation.isLoading}>
              <Button.Text>{isLoading ? 'Creating your account...' : 'Create account'}</Button.Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const useStyles = ({ spacing, fontWeights, fontSizes, colors }: Theme) => {
  return StyleSheet.create({
    container: {
      position: 'relative',
      justifyContent: 'center',
      flex: 1,
      paddingVertical: spacing.xl,
      paddingHorizontal: responsive({ base: spacing.base, sm: spacing.lg, md: spacing.xl }),
    },
    headingContainer: {
      width: responsive({ base: undefined, sm: '100%' }),
      maxWidth: responsive({ base: undefined, sm: 448 }),
      marginBottom: spacing.lg,
    },
    heading: {
      textAlign: 'center',
      fontSize: fontSizes['3xl'],
      fontWeight: fontWeights.extrabold,
      color: colors.text.primary.normal,
    },
    subHeadingContainer: {
      marginTop: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    subHeading: {
      textAlign: 'center',
      fontSize: fontSizes.sm,
      color: colors.text.primary.muted,
    },
    errorText: {
      textAlign: 'center',
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      color: colors.text.danger.muted,
      marginBottom: spacing.lg,
    },
  });
};

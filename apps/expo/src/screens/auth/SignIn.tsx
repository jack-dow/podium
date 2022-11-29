import type { TextInput } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/buttons/Button';
import { EmailInput } from '@/components/ui/inputs/EmailInput';
import { PasswordInput } from '@/components/ui/inputs/PasswordInput';
import type { RootStackParamList } from '@/_app';
import { Anchor } from '@/components/ui/navigation/Anchor';
import { SafeAreaView } from '@/components/ui/layout/SafeAreaView';
import type { Theme } from '@/themes';
import { useTheme } from '@/themes';
import { responsive } from '@/responsive';
import { supabase } from '@/lib/supabsae';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

interface FormValues {
  email: string;
  password: string;
}

const EMAIL_REGEX =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])+)\])/;

export const SignInScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const styles = useStyles(theme);
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
      <View style={styles.container}>
        <View>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Sign in to your account</Text>
            <View style={styles.subHeadingContainer}>
              <Text style={styles.subHeading}>Don&apos;t have an account? </Text>
              <Anchor onPress={() => navigation.navigate('SignUp')}>Register now</Anchor>
            </View>
          </View>

          {error && (
            <Text style={styles.errorText}>
              {error === 'Invalid login credentials' ? 'These credentials do not match our records.' : error}
            </Text>
          )}

          <View>
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
                  returnKeyType="go"
                  blurOnSubmit={false}
                  ref={passwordRef}
                  invalid={fieldState.error?.message}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  onSubmitEditing={handleSignInSubmit}
                  style={{ marginBottom: theme.spacing.lg }}
                />
              )}
            />

            <Button variant="secondary" onPress={handleSignInSubmit} loading={isLoading}>
              <Button.Text>{isLoading ? 'Signing you in...' : 'Sign in to your account'}</Button.Text>
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

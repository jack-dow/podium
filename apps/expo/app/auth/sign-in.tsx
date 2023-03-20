import React, { useRef, useState } from "react";
import { View, type TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { Anchor, Button, EmailInput, Label, PasswordInput, SafeAreaView, Text } from "~/ui";

interface FormValues {
  email: string;
  password: string;
}

const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])+)\])/;

const SignIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const { handleSubmit, control } = useForm<FormValues>();

  const passwordRef = useRef<TextInput>(null);

  const handleSignInSubmit = handleSubmit(async ({ email, password }) => {
    setIsLoading(true);
    setError(null);

    setIsLoading(false);
  });

  return (
    <SafeAreaView>
      <View className="relative flex-1 justify-center py-xl px-base  sm:px-lg md:px-xl">
        <View className="space-y-lg">
          <View className="sm:w-full sm:max-w-[448px]">
            <Text weight="extrabold" className=" text-center text-2xl text-primary-normal">
              Sign in to your account
            </Text>
            <View className="mt-sm flex-row items-center justify-center">
              <Text className="text-center text-sm text-primary-muted">Don&apos;t have an account? </Text>
              <Anchor onPress={() => router.push("/auth/sign-up")}>Register now</Anchor>
            </View>
          </View>

          {error && (
            <Text weight="medium" className="text-center text-xs text-danger-muted">
              {error === "Invalid login credentials" ? "These credentials do not match our records." : error}
            </Text>
          )}

          <View className="space-y-lg">
            <View>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Please fill in this field.",
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "Please enter a valid email address.",
                  },
                }}
                render={({ field: { value, onChange, onBlur }, fieldState }) => (
                  <>
                    <Label>Email address</Label>
                    <EmailInput
                      returnKeyType="next"
                      value={value}
                      onChangeText={onChange}
                      invalid={!!fieldState.error?.message}
                      onBlur={onBlur}
                      blurOnSubmit={false}
                      onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                    {fieldState.error?.message && (
                      <EmailInput.ErrorText>{fieldState.error.message}</EmailInput.ErrorText>
                    )}
                  </>
                )}
              />
            </View>

            <View>
              <Controller
                name="password"
                control={control}
                rules={{ required: "Please fill in this field." }}
                render={({ field: { value, onChange, onBlur }, fieldState }) => (
                  <>
                    <Label>Password</Label>
                    <PasswordInput
                      ref={passwordRef}
                      returnKeyType="go"
                      onChangeText={onChange}
                      invalid={!!fieldState.error?.message}
                      value={value}
                      onBlur={onBlur}
                      blurOnSubmit={false}
                      onSubmitEditing={handleSignInSubmit}
                    />
                    {fieldState.error?.message && (
                      <PasswordInput.ErrorText>{fieldState.error.message}</PasswordInput.ErrorText>
                    )}
                  </>
                )}
              />
            </View>

            <Button intent="secondary" onPress={handleSignInSubmit} loading={isLoading}>
              <Button.Text weight="semibold">{isLoading ? "Signing you in..." : "Sign in to your account"}</Button.Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

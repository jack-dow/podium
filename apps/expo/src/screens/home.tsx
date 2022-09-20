import { Platform, SafeAreaView, StatusBar, Text, View } from 'react-native';
import React from 'react';

import { Button } from '@/components/buttons/Button';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }} className="h-full">
      <View className="relative h-full flex-1 overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
        <View className="relative flex flex-1 flex-col items-center justify-center pt-12 pb-16">
          <View className="mb-6 sm:mx-auto sm:w-full sm:max-w-md">
            <Text className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</Text>
            <Text className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?
              {/* Don&apos;t have an account? <Anchor href="/register">Register now</Anchor> */}
            </Text>
          </View>
          <View className="w-full pb-4">
            <EmailInput label="Email address" />
          </View>
          <View className="w-full pb-4">
            <PasswordInput label="Password" />
          </View>
          <View className="w-full">
            <Button color="slate" fullWidth>
              Sign in to your account
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

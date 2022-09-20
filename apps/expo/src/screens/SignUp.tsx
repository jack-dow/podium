import { Platform, SafeAreaView, StatusBar, Text, View } from 'react-native';
import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '@/components/buttons/Button';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import type { RootStackParamList } from '@/_app';
import { Anchor } from '@/components/navigation/Anchor';
import { TextInput } from '@/components/inputs/TextInput';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export const SignUpScreen = ({ route, navigation }: Props) => {
  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }} className="h-full">
      <View className="relative h-full flex-1 overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
        <View className="relative flex flex-1 flex-col items-center justify-center space-y-6 pt-0 pb-16">
          <View className="sm:mx-auto sm:w-full sm:max-w-md">
            <Text className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</Text>
            <View className="mt-4 flex-row items-center justify-center">
              <Text className="flex text-center text-sm text-gray-600">Have an account? </Text>
              <Anchor onPress={() => navigation.navigate('SignIn')}>Login instead</Anchor>
            </View>
          </View>

          <View className="w-full">
            <TextInput label="Name" returnKeyType="next" />
          </View>

          <View className="w-full">
            <EmailInput label="Email address" returnKeyType="next" />
          </View>

          <View className="w-full">
            <PasswordInput label="Password" returnKeyType="next" />
          </View>

          <View className="w-full">
            <Button color="slate" fullWidth>
              Create Account
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Platform } from 'react-native';
import { TRPCProvider } from './utils/trpc';
import { HomeScreen } from './screens/home';
import { SignInScreen } from './screens/SignIn';
import { SignUpScreen } from './screens/SignUp';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ animationTypeForReplace: 'pop' }}
              // options={{ animation: Platform.OS === 'android' ? 'slide_from_right' : 'default' }}
            />
            <RootStack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ animationTypeForReplace: 'pop' }}
              // options={{ animation: Platform.OS === 'android' ? 'slide_from_right' : 'default' }}
            />
          </RootStack.Navigator>
          <StatusBar />
        </NavigationContainer>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

registerRootComponent(App);

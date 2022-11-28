/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { registerRootComponent } from 'expo';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import 'react-native-url-polyfill/auto';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { atom, useAtom } from 'jotai';
import { TRPCProvider } from './utils/trpc';
import { HomeScreen } from './screens/Home';
import { SignInScreen } from './screens/auth/SignIn';
import { SignUpScreen } from './screens/auth/SignUp';
import { LoadingScreen } from './screens/Loading';
import { ExercisesScreen } from './screens/Exercises';
import { NotificationProvider } from './components/feedback/Notification';
import { ExerciseEditorScreen } from './screens/ExerciseEditor';

import { ThemeProvider, themeLight } from './themes';
import { SafeAreaView } from './components/layout/SafeAreaView';
import { TemplateEditorScreen } from './screens/TemplateEditor';
import { PlaygroundScreen } from './screens/Playground';
import { useAuthAPI, useAuthSession } from './stores/global/auth';
import type { Session } from '@/lib/supabsae';
import { supabase } from '@/lib/supabsae';

export type RootStackParamList = {
  Playground: undefined;
  Home: undefined;
  Exercises: undefined;
  ExerciseEditor: { exerciseId: string };
  TemplateEditor: { templateId: string };
  SignIn: undefined;
  SignUp: undefined;
  Loading: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const App = () => {
  const session = useAuthSession();
  const { setSession } = useAuthAPI();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [setSession]);

  const [isFontsLoaded] = useFonts({
    InterThin: require('../assets/fonts/Inter/static/Inter-Thin.ttf'),
    InterExtraLight: require('../assets/fonts/Inter/static/Inter-ExtraLight.ttf'),
    InterLight: require('../assets/fonts/Inter/static/Inter-Light.ttf'),
    Inter: require('../assets/fonts/Inter/static/Inter-Regular.ttf'),
    InterMedium: require('../assets/fonts/Inter/static/Inter-Medium.ttf'),
    InterSemiBold: require('../assets/fonts/Inter/static/Inter-SemiBold.ttf'),
    InterBold: require('../assets/fonts/Inter/static/Inter-Bold.ttf'),
    InterExtraBold: require('../assets/fonts/Inter/static/Inter-ExtraBold.ttf'),
    InterBlack: require('../assets/fonts/Inter/static/Inter-Black.ttf'),
  });

  if (!isFontsLoaded) {
    return <View />;
  }

  return (
    <TRPCProvider>
      {/* Safe Area Manager */}
      <SafeAreaProvider>
        <ThemeProvider value={themeLight}>
          {/* Gesture Handler */}
          <GestureHandlerRootView style={{ flex: 1 }}>
            {/* React Navigation */}
            <NavigationContainer>
              <ExpoStatusBar translucent backgroundColor="transparent" />
              <RootStack.Navigator screenOptions={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }}>
                {session === undefined ? (
                  <RootStack.Screen name="Loading" component={LoadingScreen} />
                ) : session == null ? (
                  <>
                    <RootStack.Screen name="SignIn" component={SignInScreen} />
                    <RootStack.Screen name="SignUp" component={SignUpScreen} />
                  </>
                ) : (
                  <>
                    {/* <RootStack.Screen name="Loading" component={LoadingScreen} /> */}
                    {/* <RootStack.Screen name="Playground" component={PlaygroundScreen} /> */}
                    {/* <RootStack.Screen name="Home" component={HomeScreen} /> */}
                    <RootStack.Screen name="TemplateEditor" component={TemplateEditorScreen} />
                    {/* <RootStack.Screen name="Exercises" component={ExercisesScreen} /> */}
                    {/* <RootStack.Screen name="ExerciseEditor" component={ExerciseEditorScreen} /> */}
                  </>
                )}
              </RootStack.Navigator>
            </NavigationContainer>
          </GestureHandlerRootView>
        </ThemeProvider>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

registerRootComponent(App);

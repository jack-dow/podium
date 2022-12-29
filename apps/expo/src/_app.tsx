/* eslint-disable @typescript-eslint/consistent-type-definitions */
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-url-polyfill/auto';
import { enableMapSet } from 'immer';

import { TRPCProvider } from './trpc';
import { useAuthAPI, useAuthSession } from './stores/global/AuthProvider';
import { supabase } from './supabase';

import { HomeScreen } from './screens/Home';
import { SignInScreen } from './screens/auth/SignIn';
import { SignUpScreen } from './screens/auth/SignUp';
import { LoadingScreen } from './screens/Loading';
import { ExercisesScreen } from './screens/Exercises';
import { ExerciseEditorScreen } from './screens/ExerciseEditor';
import { TemplateEditorScreen } from './screens/TemplateEditor';
import { PlaygroundScreen } from './screens/Playground';
import { TemplatesScreen } from './screens/Templates';

// Required to use immer with Maps and Sets (https://immerjs.github.io/immer/docs/installation#enablemapset)
enableMapSet();

export type RootStackParamList = {
  Playground: undefined;
  Home: undefined;
  Exercises: undefined;
  ExerciseEditor: { exerciseId: string | null };
  Templates: undefined;
  TemplateEditor: { templateId: string | null };
  SignIn: undefined;
  SignUp: undefined;
  Loading: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export const App = () => {
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
    'Inter-Thin': require('../assets/fonts/Inter/static/Inter-Thin.ttf'),
    'Inter-ExtraLight': require('../assets/fonts/Inter/static/Inter-ExtraLight.ttf'),
    'Inter-Light': require('../assets/fonts/Inter/static/Inter-Light.ttf'),
    'Inter': require('../assets/fonts/Inter/static/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter/static/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter/static/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter/static/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('../assets/fonts/Inter/static/Inter-ExtraBold.ttf'),
    'Inter-Black': require('../assets/fonts/Inter/static/Inter-Black.ttf'),
  });

  if (!isFontsLoaded) {
    return <View />;
  }

  return (
    <TRPCProvider>
      {/* Safe Area Manager */}
      <SafeAreaProvider>
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
                  <RootStack.Screen name="Home" component={HomeScreen} />
                  <RootStack.Screen name="Exercises" component={ExercisesScreen} />
                  <RootStack.Screen name="ExerciseEditor" component={ExerciseEditorScreen} />
                  <RootStack.Screen name="Templates" component={TemplatesScreen} />
                  <RootStack.Screen name="TemplateEditor" component={TemplateEditorScreen} />
                  <RootStack.Screen name="Playground" component={PlaygroundScreen} />
                </>
              )}
            </RootStack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

registerRootComponent(App);

/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { registerRootComponent } from 'expo';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { DripsyProvider } from 'dripsy';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import 'react-native-url-polyfill/auto';

import type { Session } from '@supabase/supabase-js';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider } from '@gorhom/portal';
import { TRPCProvider } from './utils/trpc';
import { HomeScreen } from './screens/Home';
import { SignInScreen } from './screens/auth/SignIn';
import { SignUpScreen } from './screens/auth/SignUp';
import { supabase } from './lib/supabase';
import { LoadingScreen } from './screens/Loading';
import { ExercisesScreen } from './screens/Exercises';
import { darkTheme, theme } from './themes';
import { ExerciseNewScreen } from './screens/exercises/ExerciseNew';
import { NotificationProvider } from './components/feedback/Notification';
import { ExerciseIdScreen } from './screens/exercises/ExerciseId';

export type RootStackParamList = {
  Home: undefined;
  Exercises: undefined;
  ExerciseNew: undefined;
  ExerciseId: { exerciseId: string };
  SignIn: undefined;
  SignUp: undefined;
  Loading: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

function Fonts({ children }: { children: React.ReactNode }) {
  const [loaded] = useFonts({
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

  return <>{loaded && children}</>;
}

const App = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Fonts>
      {/* TRPC */}
      <TRPCProvider>
        {/* Dripsy */}
        <DripsyProvider theme={theme}>
          {/* Safe Area Manager */}
          <SafeAreaProvider>
            {/* Gesture Handler */}
            <GestureHandlerRootView style={{ flex: 1 }}>
              {/* Portal Manager */}
              <PortalProvider>
                {/* Notification Manager */}
                <NotificationProvider>
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
                          {/* <RootStack.Screen name="Home" component={HomeScreen} /> */}
                          <RootStack.Screen name="Exercises" component={ExercisesScreen} />
                          <RootStack.Screen name="ExerciseNew" component={ExerciseNewScreen} />
                          <RootStack.Screen name="ExerciseId" component={ExerciseIdScreen} />
                          {/* <RootStack.Screen name="Loading" component={LoadingScreen} /> */}
                        </>
                      )}
                    </RootStack.Navigator>
                    {/* </View> */}
                  </NavigationContainer>
                </NotificationProvider>
              </PortalProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </DripsyProvider>
      </TRPCProvider>
    </Fonts>
  );
};

registerRootComponent(App);

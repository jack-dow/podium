/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "fast-text-encoding";
import React, { useCallback } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { OverlayManager } from "~/ui";
import { TRPCProvider } from "~/api";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
SplashScreen.preventAutoHideAsync();

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  const [isFontsLoaded] = useFonts({
    "Inter-Thin": require("../assets/fonts/Inter/Inter-Thin.ttf"),
    "Inter-ExtraLight": require("../assets/fonts/Inter/Inter-ExtraLight.ttf"),
    "Inter-Light": require("../assets/fonts/Inter/Inter-Light.ttf"),
    Inter: require("../assets/fonts/Inter/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/Inter/Inter-ExtraBold.ttf"),
    "Inter-Black": require("../assets/fonts/Inter/Inter-Black.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (isFontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isFontsLoaded]);

  if (!isFontsLoaded) {
    return null;
  }

  return (
    <TRPCProvider>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <ClerkProvider publishableKey="pk_test_Z3VpZGVkLXBpZ2Vvbi00MS5jbGVyay5hY2NvdW50cy5kZXYk">
          {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
          <OverlayManager.PortalProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar translucent backgroundColor="transparent" />
          </OverlayManager.PortalProvider>
        </ClerkProvider>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

export default RootLayout;

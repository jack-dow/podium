import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import type GorhomBottomSheet from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";

import { BottomSheet } from "~/ui/overlays/BottomSheet";
import { Button, Dialog, OverlayManager } from "~/ui";
import { api } from "~/api";

const Index = () => {
  const router = useRouter();

  return (
    <SafeAreaView>
      {/* Changes page title visible on the header */}
      <Stack.Screen />
      <View className="h-full w-full space-y-md p-md">
        <Text className="mx-auto pb-sm text-5xl font-bold text-primary-normal">Podium</Text>
        <Button
          onPress={() => {
            router.push("/exercises");
          }}
        >
          <Button.Text>Exercises</Button.Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Index;

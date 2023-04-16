import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import type GorhomBottomSheet from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import clsx from "clsx";

import { BottomSheet, Button, Dialog, OverlayManager, SafeAreaView } from "~/ui";

const Index = () => {
  const router = useRouter();

  return (
    <SafeAreaView>
      {/* Changes page title visible on the header */}
      {/* <Stack.Screen /> */}

      <View className="h-full w-full space-y-md p-md">
        <Text className="mx-auto pb-sm text-5xl font-bold text-primary-normal">Podium</Text>
        <Button
          onPress={() => {
            router.push("/exercises");
          }}
        >
          <Button.Text>Exercises</Button.Text>
        </Button>
        <Button
          onPress={() => {
            router.push("/templates");
          }}
        >
          <Button.Text>Templates</Button.Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Index;

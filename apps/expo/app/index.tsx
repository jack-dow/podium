import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { Button } from "@/ui";

const Index = () => {
  return (
    <SafeAreaView>
      {/* Changes page title visible on the header */}
      <Stack.Screen />
      <View className="h-full w-full p-md">
        <Text className="mx-auto pb-sm text-5xl font-bold text-primary-normal">
          Create <Text className="text-positive-normal">T3</Text> PeePoo
        </Text>
        <Button>
          <Button.Text>Hello World</Button.Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Index;

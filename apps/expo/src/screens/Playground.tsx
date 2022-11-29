import React, { useEffect, useRef, useState } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Button } from '@ui/buttons/Button';
import { SafeAreaView } from '@ui/layout/SafeAreaView';
import type { RootStackParamList } from '@/_app';

type Props = NativeStackScreenProps<RootStackParamList, 'Playground'>;

export const PlaygroundScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView>
      <View className="flex-1 bg-tertiary p-md">
        <Text className=" text-danger-normal">Hello world!</Text>
      </View>
    </SafeAreaView>
  );
};

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Button } from '@ui/buttons/Button';
import { Anchor } from '@ui/navigation/Anchor';
import { SafeAreaView } from '@ui/layout/SafeAreaView';

import { supabase } from '@/supabase';
import type { RootStackParamList } from '@/_app';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView>
      <View className="relative flex-1 space-y-base p-md pb-xl md:px-lg">
        <ScrollView>
          <View className="flex-row space-x-sm">
            <Anchor onPress={() => navigation.navigate('Exercises')}>Exercises</Anchor>
            <Anchor onPress={() => navigation.navigate('Templates')}>Templates</Anchor>
          </View>
        </ScrollView>
        <View className="absolute top-md right-md">
          <Button intent="tertiary" onPress={() => supabase.auth.signOut()}>
            <Button.Text>Logout!</Button.Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

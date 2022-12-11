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
      <ScrollView className="relative flex-1 space-y-base p-md pb-xl md:px-lg">
        <View className="space-y-sm">
          <Anchor onPress={() => navigation.navigate('Exercises')}>Exercises</Anchor>
          <Anchor onPress={() => navigation.navigate('TemplateEditor', { templateId: null })}>Templates</Anchor>
        </View>

        <View className="pb-lg">
          <Button intent="tertiary" onPress={() => supabase.auth.signOut()}>
            <Button.Text>Logout!</Button.Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

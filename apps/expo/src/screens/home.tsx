import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Alert } from '@ui/feedback/Alert';
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

        <View className="space-y-md">
          {['primary', 'secondary', 'tertiary', 'positive', 'warning', 'danger'].map((intent) => (
            <View key={intent}>
              <ButtonGroup
                intent={intent as 'primary' | 'secondary' | 'tertiary' | 'positive' | 'warning' | 'danger'}
              />
            </View>
          ))}
        </View>

        <View className="space-y-md">
          {['positive', 'warning', 'danger', 'info'].map((intent) => (
            <View key={intent}>
              <Alert intent={intent as 'positive' | 'warning' | 'danger' | 'info'}>
                <Alert.Title>There were 2 errors with your submission</Alert.Title>
                <Alert.Content>
                  <Alert.ListItem>Your password must be at least 8 characters</Alert.ListItem>
                  <Alert.ListItem>Your password must include at least one pro wrestling finishing move</Alert.ListItem>
                </Alert.Content>
              </Alert>
            </View>
          ))}
          {['positive', 'warning', 'danger', 'info'].map((intent) => (
            <View key={intent}>
              <Alert intent={intent as 'positive' | 'warning' | 'danger' | 'info'}>
                <Alert.Title weight="normal">Attention needed</Alert.Title>
              </Alert>
            </View>
          ))}
        </View>

        <Button intent="tertiary" onPress={() => supabase.auth.signOut()}>
          <Button.Text>Logout!</Button.Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

interface ButtonGroupProps {
  intent: 'primary' | 'secondary' | 'tertiary' | 'positive' | 'warning' | 'danger';
}

function ButtonGroup({ intent }: ButtonGroupProps) {
  return (
    <View className="flex-row space-x-md">
      <Button intent={intent}>
        <Button.Text>Hello world</Button.Text>
      </Button>
      <Button intent={intent} loading>
        <Button.Text>Hello world</Button.Text>
      </Button>
    </View>
  );
}

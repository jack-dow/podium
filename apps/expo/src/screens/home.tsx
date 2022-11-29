import React from 'react';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/buttons/Button';
import type { RootStackParamList } from '@/_app';

import { Anchor } from '@/components/ui/navigation/Anchor';
import { SafeAreaView } from '@/components/ui/layout/SafeAreaView';
import { useTheme } from '@/themes';
import { responsive } from '@/responsive';
import { supabase } from '@/lib/supabsae';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const { spacing } = useTheme();
  return (
    <SafeAreaView>
      <View
        style={{
          position: 'relative',
          flex: 1,
          paddingHorizontal: responsive({ base: spacing.md, md: spacing.lg }),
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,
        }}
      >
        <Text>Hello world!</Text>
        <View style={{ paddingVertical: 6 }}>
          <Anchor size="lg" onPress={() => navigation.navigate('Exercises')}>
            Exercises
          </Anchor>
          <Anchor size="lg" onPress={() => navigation.navigate('TemplateEditor', { templateId: 'new' })}>
            Templates
          </Anchor>
        </View>
        <Button
          variant="tertiary"
          onPress={() => {
            supabase.auth.signOut();
          }}
        >
          <Button.Text>Logout!</Button.Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

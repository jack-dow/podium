import { Text, View } from 'dripsy';
import React from 'react';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@/components/buttons/Button';
import { supabase } from '@/lib/supabase';
import type { RootStackParamList } from '@/_app';

import { Anchor } from '@/components/navigation/Anchor';
import { SafeAreaView } from '@/components/layout/SafeAreaView';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation, route }: Props) => {
  return (
    <SafeAreaView>
      <View sx={{ position: 'relative', flex: 1, px: ['md', null, 'lg'], pt: 'md', pb: 'xl' }}>
        <Text>Hello world!</Text>
        <View sx={{ py: 6 }}>
          <Anchor size="lg" onPress={() => navigation.navigate('Exercises')}>
            Exercises
          </Anchor>
        </View>
        <Button
          variant="tertiary"
          onPress={() => {
            supabase.auth.signOut();
          }}
        >
          Logout!
        </Button>
      </View>
    </SafeAreaView>
  );
};

import React from 'react';
import { View } from 'react-native';
import { Loader } from '@/components/ui/feedback/Loader';
import { SafeAreaView } from '@/components/ui/layout/SafeAreaView';

export const LoadingScreen = () => {
  return (
    <SafeAreaView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Loader />
      </View>
    </SafeAreaView>
  );
};

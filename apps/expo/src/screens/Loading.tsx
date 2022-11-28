import React from 'react';
import { View } from 'react-native';
import { Loader } from '@/components/feedback/Loader';
import { SafeAreaView } from '@/components/layout/SafeAreaView';

export const LoadingScreen = () => {
  return (
    <SafeAreaView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Loader />
      </View>
    </SafeAreaView>
  );
};

import React from 'react';
import { View } from 'dripsy';
import { Loader } from '@/components/feedback/Loader';
import { SafeAreaView } from '@/components/layout/SafeAreaView';

export const LoadingScreen = () => {
  return (
    <SafeAreaView sx={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <Loader />
    </SafeAreaView>
  );
};

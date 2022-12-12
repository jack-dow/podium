import { ScrollView, View } from 'react-native';
import React, { useCallback } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import clsx from 'clsx';

import { Layout } from '@ui/layout/Layout';
import { Anchor } from '@ui/navigation/Anchor';
import { SafeAreaView } from '@ui/layout/SafeAreaView';
import { Text } from '@ui/typography/Text';

import { Loader } from '@ui/feedback/Loader';
import type { RootStackParamList } from '@/_app';
import { trpc } from '@/trpc';

type Props = NativeStackScreenProps<RootStackParamList, 'Templates'>;

export const TemplatesScreen = ({ navigation }: Props) => {
  const { data, isLoading, refetch } = trpc.template.all.useQuery({ limit: 50 });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <SafeAreaView>
      <Layout
        title="Templates"
        description="Here you can manage the templates that are referenced in your plans and workouts"
        titleRightSection={
          <Anchor onPress={() => navigation.navigate('ExerciseEditor', { exerciseId: null })}>New exercise</Anchor>
        }
      >
        {isLoading ? (
          <View className="h-full w-full flex-1 items-center justify-center">
            <Loader />
          </View>
        ) : (
          <ScrollView>
            {data?.items.map((template, index) => {
              const isFirst = index === 0;
              const isLast = index === data.items.length - 1;
              return (
                <View
                  key={template.id}
                  className={clsx(
                    'border border-primary-normal p-sm shadow',
                    isFirst ? 'rounded-t-md' : '',
                    isLast ? 'rounded-b-md border-b' : '',
                  )}
                >
                  <View className="p-sm sm:px-lg">
                    <View className="flex-row items-center justify-between">
                      <Text weight="medium" className="truncate text-base capitalize text-primary-normal">
                        {template.name}
                      </Text>
                      <Anchor
                        onPress={() => {
                          navigation.navigate('TemplateEditor', { templateId: template.id });
                        }}
                      >
                        Edit
                      </Anchor>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </Layout>
    </SafeAreaView>
  );
};

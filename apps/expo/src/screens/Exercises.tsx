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

type Props = NativeStackScreenProps<RootStackParamList, 'Exercises'>;

export const ExercisesScreen = ({ navigation }: Props) => {
  const { data, isLoading, refetch } = trpc.exercise.all.useQuery({ limit: 50 });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <SafeAreaView>
      <Layout>
        <Layout.Header>
          <Layout.BackButton />
          <View className="flex-row items-center justify-between">
            <Layout.Title>Exercises</Layout.Title>
            <Anchor onPress={() => navigation.navigate('ExerciseEditor', { exerciseId: null })}>New exercise</Anchor>
          </View>
          <Layout.Description>
            Here you can manage the exercises that are referenced in your plans and single workouts
          </Layout.Description>
        </Layout.Header>
        <Layout.Content>
          {isLoading ? (
            <View className="h-full w-full flex-1 items-center justify-center">
              <Loader />
            </View>
          ) : (
            <ScrollView className="my-base px-base">
              {data?.items.map((exercise, index) => {
                const isFirst = index === 0;
                const isLast = index === data.items.length - 1;
                return (
                  <View
                    key={exercise.id}
                    className={clsx(
                      'border-2 border-primary-normal p-sm',
                      isFirst ? 'rounded-t-md' : '',
                      isLast ? 'rounded-b-md' : 'border-b-0',
                    )}
                  >
                    <View className="p-sm sm:px-lg">
                      <View className="flex-row items-center justify-between">
                        <Text weight="medium" className="truncate text-base capitalize text-primary-normal">
                          {exercise.name}
                        </Text>
                        <Anchor
                          onPress={() => {
                            navigation.navigate('ExerciseEditor', { exerciseId: exercise.id });
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
        </Layout.Content>
      </Layout>
    </SafeAreaView>
  );
};

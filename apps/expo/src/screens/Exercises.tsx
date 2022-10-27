import { Text, View } from 'dripsy';
import { ScrollView } from 'react-native';
import React, { useEffect } from 'react';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { Layout } from '@/components/layout/Layout';
import { trpc } from '@/utils/trpc';
import { Anchor } from '@/components/navigation/Anchor';
import type { RootStackParamList } from '@/_app';
import { SafeAreaView } from '@/components/layout/SafeAreaView';

type Props = NativeStackScreenProps<RootStackParamList, 'Exercises'>;

export const ExercisesScreen = ({ navigation }: Props) => {
  const { data, isLoading, refetch } = trpc.exercises.all.useQuery({ limit: 50 });
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  return (
    <SafeAreaView>
      <Layout
        title="Exercises"
        description="Here you can manage the exercises that are referenced in your plans and single workouts"
        titleRightSection={<Anchor onPress={() => navigation.navigate('ExerciseNew')}>New exercise</Anchor>}
      >
        <ScrollView>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            data?.items.map((exercise, index) => {
              const isFirst = index === 0;
              const isLast = index === data.items.length - 1;
              return (
                <View
                  key={exercise.id}
                  sx={{
                    boxShadow: 'base',
                    borderWidth: 1,
                    borderColor: 'border-primary',
                    borderBottomWidth: isLast ? 1 : 0,
                    borderTopRightRadius: isFirst ? 'md' : 0,
                    borderTopLeftRadius: isFirst ? 'md' : 0,
                    borderBottomRightRadius: isLast ? 'md' : 0,
                    borderBottomLeftRadius: isLast ? 'md' : 0,
                  }}
                >
                  <View sx={{ p: 'md', px: [null, 'lg'] }}>
                    <View sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text
                        variants={['lg', 'truncated', 'normal']}
                        sx={{ fontWeight: 'medium', textTransform: 'capitalize' }}
                      >
                        {exercise.name}
                      </Text>
                      <Anchor
                        onPress={() => {
                          navigation.navigate('ExerciseId', { exerciseId: exercise.id });
                        }}
                      >
                        Edit
                      </Anchor>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

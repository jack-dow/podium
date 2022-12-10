import { ScrollView, Text, View } from 'react-native';
import React, { useEffect } from 'react';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { Layout } from '@/components/ui/layout/Layout';
import { trpc } from '@/trpc';
import { Anchor } from '@/components/ui/navigation/Anchor';
import type { RootStackParamList } from '@/_app';
import { SafeAreaView } from '@/components/ui/layout/SafeAreaView';
import { useTheme } from '@/themes';
import { responsive } from '@/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'Exercises'>;

export const ExercisesScreen = ({ navigation }: Props) => {
  const { data, isLoading, refetch } = trpc.exercises.all.useQuery({ limit: 50 });
  const isFocused = useIsFocused();
  const { shadows, colors, borderWeights, spacing, fontWeights, fontSizes, utils } = useTheme();

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
        titleRightSection={
          <Anchor onPress={() => navigation.navigate('ExerciseEditor', { exerciseId: 'new' })}>New exercise</Anchor>
        }
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
                  style={{
                    ...shadows.base,
                    borderWidth: borderWeights.light,
                    borderColor: colors.border.primary.normal,
                    borderBottomWidth: isLast ? 1 : 0,
                    borderTopRightRadius: isFirst ? spacing.base : 0,
                    borderTopLeftRadius: isFirst ? spacing.base : 0,
                    borderBottomRightRadius: isLast ? spacing.base : 0,
                    borderBottomLeftRadius: isLast ? spacing.base : 0,
                    padding: spacing.sm,
                  }}
                >
                  <View style={{ padding: spacing.base, paddingHorizontal: responsive({ base: 0, sm: spacing.lg }) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text
                        style={{
                          fontWeight: fontWeights.medium,
                          textTransform: 'capitalize',
                          fontSize: fontSizes.xl,
                          color: colors.text.primary.normal,
                          ...utils.truncated,
                        }}
                      >
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
            })
          )}
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

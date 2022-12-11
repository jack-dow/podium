import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-get-random-values';
import { useAtom } from 'jotai';
import clsx from 'clsx';

import { Layout } from '@ui/layout/Layout';
import { SafeAreaView } from '@ui/layout/SafeAreaView';
import { Text } from '@ui/typography/Text';

import type { RootStackParamList } from '@/_app';

import { ExerciseSelectTab, stepsCompletedAtom } from '@/components/TemplateEditor/ExerciseSelect';
import { SetsAndRepsTab, templateSubmittedAtom } from '@/components/TemplateEditor/SetsAndReps';
import { TemplateProvider } from '@/stores/local/TemplateProvider';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TabNavigationParamList = {
  ExerciseSelect: { isTemplateNew: boolean };
  SetsAndReps: { isTemplateNew: boolean };
};

const Tab = createBottomTabNavigator<TabNavigationParamList>();

type Props = StackScreenProps<RootStackParamList, 'TemplateEditor'>;

export const TemplateEditorScreen = ({ route, navigation }: Props) => {
  const [submitted] = useAtom(templateSubmittedAtom);

  useEffect(() => {
    if (submitted) {
      navigation.goBack();
    }
  }, [submitted, navigation]);

  return (
    <TemplateProvider id={route?.params?.templateId ?? null}>
      <SafeAreaView>
        <Layout title="Create Template" description="Configure this workout template">
          <Tab.Navigator
            sceneContainerStyle={{ backgroundColor: 'transparent' }}
            screenOptions={{ headerShown: false, tabBarStyle: { position: 'absolute' } }}
            tabBar={(props) => <TabBars {...props} />}
          >
            <Tab.Screen
              name="ExerciseSelect"
              component={ExerciseSelectTab}
              options={{ title: 'Select Exercises' }}
              initialParams={{
                isTemplateNew: !!route?.params?.templateId,
              }}
            />
            <Tab.Screen
              name="SetsAndReps"
              component={SetsAndRepsTab}
              options={{ title: 'Sets & Reps' }}
              initialParams={{
                isTemplateNew: !!route?.params?.templateId,
              }}
            />
          </Tab.Navigator>
        </Layout>
      </SafeAreaView>
    </TemplateProvider>
  );
};

const TabBars = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const [stepsCompleted] = useAtom(stepsCompletedAtom);

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]!;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const isDisabled = stepsCompleted < index;

          const handlePress = () => {
            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          return (
            <View key={route.key} className={clsx('flex-1', index === 0 ? 'pr-base' : 'pr-none')}>
              <Pressable
                onPress={handlePress}
                disabled={isDisabled}
                className={clsx(
                  'w-full border-t-4 pt-base',
                  isFocused ? 'border-primary-active' : 'border-primary-normal',
                  isDisabled ? 'opacity-30' : 'opacity-100',
                )}
              >
                {({ pressed }) => {
                  return (
                    <>
                      <Text
                        weight="bold"
                        className={clsx(
                          'text-sm uppercase',
                          isFocused
                            ? 'text-interactive-primary-normal'
                            : pressed
                            ? 'text-interactive-primary-active'
                            : 'text-primary-muted',
                        )}
                      >
                        Step {index + 1}
                      </Text>
                      <Text weight="medium" className="text-sm">
                        {label}
                      </Text>
                    </>
                  );
                }}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

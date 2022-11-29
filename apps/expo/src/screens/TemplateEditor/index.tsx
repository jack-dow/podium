import React from 'react';

import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
import 'react-native-get-random-values';

import { useAtom } from 'jotai';
import { SetsAndRepsTab } from './SetsAndReps';
import { ExerciseSelectTab, stepsCompletedAtom } from './ExerciseSelect';
import type { RootStackParamList } from '@/_app';
import { Layout } from '@/components/ui/layout/Layout';
import { SafeAreaView } from '@/components/ui/layout/SafeAreaView';
import { useTheme } from '@/themes';
import { trpc } from '@/utils/trpc';
import { Loader } from '@/components/ui/feedback/Loader';
import { TemplateProvider } from '@/providers/FullTemplateProvider';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TabNavigationParamList = {
  ExerciseSelect: undefined;
  SetsAndReps: undefined;
};

const Tab = createBottomTabNavigator<TabNavigationParamList>();

type Props = StackScreenProps<RootStackParamList, 'TemplateEditor'>;

export const TemplateEditorScreen = ({ route }: Props) => {
  return (
    <TemplateProvider id={route?.params?.templateId ?? null}>
      <SafeAreaView>
        <Layout title="Create Template" description="Configure this workout template">
          <Tab.Navigator
            sceneContainerStyle={{ backgroundColor: 'transparent' }}
            screenOptions={{ headerShown: false, tabBarStyle: { position: 'absolute' } }}
            tabBar={(props) => <TabBars {...props} />}
          >
            <Tab.Screen name="ExerciseSelect" component={ExerciseSelectTab} options={{ title: 'Select Exercises' }} />
            <Tab.Screen name="SetsAndReps" component={SetsAndRepsTab} options={{ title: 'Sets & Reps' }} />
          </Tab.Navigator>
        </Layout>
      </SafeAreaView>
    </TemplateProvider>
  );
};

const TabBars = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const [stepsCompleted] = useAtom(stepsCompletedAtom);
  const { spacing, colors, fontWeights, fontSizes } = useTheme();
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
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
            <View key={route.key} style={{ flex: 1, paddingRight: index === 0 ? spacing.base : 0 }}>
              <Pressable
                onPress={handlePress}
                disabled={isDisabled}
                style={{
                  width: '100%',
                  borderTopWidth: 4,
                  borderTopColor: isFocused ? colors.border.primary.active : colors.border.primary.normal,
                  paddingTop: spacing.base,
                  opacity: isDisabled ? 0.3 : 1,
                }}
              >
                {({ pressed }) => {
                  return (
                    <>
                      <Text
                        style={{
                          fontWeight: fontWeights.bold,
                          textTransform: 'uppercase',
                          fontSize: fontSizes.sm,
                          color: isFocused
                            ? colors.interactive.primary.active
                            : pressed
                            ? colors.interactive.primary.normal
                            : colors.text.primary.muted,
                        }}
                      >
                        Step {index + 1}
                      </Text>
                      <Text style={{ fontWeight: fontWeights.medium, fontSize: fontSizes.sm }}>{label}</Text>
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

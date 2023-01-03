import { useCallback, useMemo, useRef, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { styled } from 'nativewind';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import GorhomBottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { Button } from '@ui/buttons/Button';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PortalProvider } from '@gorhom/portal';
import { useAtom } from 'jotai';
import { Layout } from './ui/layout/Layout';
import { Stepper } from './ui/navigation/Stepper';
import { ExercisePreview, activeWorkoutStepsCompletedAtom } from './ActiveWorkout/ExercisePreview';
import { SetsAndRepsTab } from './ActiveWorkout/SetsAndReps';
import { useBottomSheetBackHandler } from '@/hooks/useBottomSheetBackHandler';
import { WorkoutProvider } from '@/stores/local/WorkoutProvider';

const StyledBackdrop = styled(BottomSheetBackdrop);

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ActiveWorkoutTabParamList = {
  ExerciseSelect: { isWorkoutNew: boolean };
  SetsAndReps: { isWorkoutNew: boolean };
};

const Tab = createBottomTabNavigator<ActiveWorkoutTabParamList>();

interface ActiveWorkoutProps {
  children: React.ReactNode;
}

export function ActiveWorkout({ children }: ActiveWorkoutProps) {
  const [isKeyboardShowing, setIsKeyboardShowing] = useState(false);

  const ref = useRef<GorhomBottomSheet>(null);
  const { handleSheetPositionChange } = useBottomSheetBackHandler(ref);
  const snapPoints = useMemo(() => ['90%'], []);

  const handleSheetOpen = useCallback(() => {
    ref.current?.expand();
  }, []);

  const handleSheetClose = useCallback(() => {
    if (isKeyboardShowing) {
      Keyboard.dismiss();
      setIsKeyboardShowing(false);
    }
  }, [isKeyboardShowing]);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <StyledBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} className="bg-overlay" />;
  }, []);

  return (
    <WorkoutProvider workout={null}>
      <PortalProvider>
        <View className="relative flex-1 pb-[74px]">{children}</View>
        <View className="absolute bottom-base w-full flex-1 bg-primary">
          <View className="mx-base bg-primary">
            <Button onPress={handleSheetOpen}>
              <Button.Text>Active Workout</Button.Text>
            </Button>
          </View>
        </View>
        <GorhomBottomSheet
          ref={ref}
          index={-1}
          onClose={handleSheetClose}
          snapPoints={snapPoints}
          onChange={handleSheetPositionChange}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
        >
          <Layout>
            <Layout.Header>
              <Layout.Title>Active Workout</Layout.Title>
              <Layout.Description>Slay</Layout.Description>
            </Layout.Header>
            <Layout.Content>
              <Tab.Navigator
                sceneContainerStyle={{ backgroundColor: 'transparent' }}
                screenOptions={{ headerShown: false, tabBarStyle: { position: 'absolute' } }}
                tabBar={(props) => <TabBars {...props} />}
              >
                <Tab.Screen
                  name="ExerciseSelect"
                  options={{ title: 'Preview Exercises' }}
                  component={ExercisePreview}
                  initialParams={{
                    isWorkoutNew: true,
                  }}
                />
                <Tab.Screen
                  name="SetsAndReps"
                  component={SetsAndRepsTab}
                  options={{ title: 'Sets & Reps' }}
                  initialParams={{
                    isWorkoutNew: true,
                  }}
                />
              </Tab.Navigator>
            </Layout.Content>
          </Layout>
        </GorhomBottomSheet>
      </PortalProvider>
    </WorkoutProvider>
  );
}

const TabBars = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const [stepsCompleted] = useAtom(activeWorkoutStepsCompletedAtom);

  return (
    <View className="mt-sm px-base pb-base">
      <Stepper active={state.index} className="space-x-md">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]!;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
              ? options.title
              : route.name;

          return (
            <Stepper.Step
              onPress={() => navigation.navigate(route.name)}
              key={index}
              index={index}
              allowStepSelect={stepsCompleted >= index}
            >
              {label}
            </Stepper.Step>
          );
        })}
      </Stepper>
    </View>
  );
};

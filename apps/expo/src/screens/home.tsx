import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import React, { useState } from 'react';
import type { ViewProps } from 'react-native';
import { Dimensions, View } from 'react-native';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import { add, format, isToday, sub } from 'date-fns';

import { Button } from '@ui/buttons/Button';
import { SafeAreaView } from '@ui/layout/SafeAreaView';

import { MotiPressable } from 'moti/interactions';
import { styled } from 'nativewind';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import clsx from 'clsx';
import { supabase } from '@/supabase';
import type { RootStackParamList } from '@/_app';
import { Text } from '@/components/ui/typography/Text';
import { CalendarDaysIcon } from '@/assets/icons/mini/CalendarDays';
import { ArrowLeftOnRectangleIcon } from '@/assets/icons/mini/ArrowLeftOnRectangle';
import { ActiveWorkout } from '@/components/ActiveWorkout';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView>
      <ActiveWorkout>
        <View className="relative flex-1 space-y-lg p-md pb-xl md:px-lg">
          <Header />
          <WeekView />
          <ScrollView className="space-y-lg">
            <View>
              <Button>
                <Button.Text>Start an empty workout</Button.Text>
              </Button>
            </View>
            <View className="flex-row justify-between space-x-sm">
              <Button onPress={() => navigation.navigate('Exercises')}>
                <Button.Text>Exercises</Button.Text>
              </Button>
              <Button onPress={() => navigation.navigate('Templates')}>
                <Button.Text>Templates</Button.Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </ActiveWorkout>
    </SafeAreaView>
  );
};

const StyledMotiPressable = styled(MotiPressable);

function HeaderRoot({ style }: { style?: ViewProps['style'] }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedDate] = useState(new Date());
  return (
    <View className="flex-row items-center justify-between" style={style}>
      <View className="flex-row items-center">
        <View className="mr-sm rounded-full bg-transparent shadow">
          <View className="items-center justify-center overflow-hidden rounded-full bg-interactive-primary-normal p-md">
            <CalendarDaysIcon className="text-white" />
          </View>
        </View>

        <View className="justify-center">
          <Text className="text-left text-sm tracking-tight text-primary-muted">{format(selectedDate, 'EEEE')}</Text>
          <Text weight="semibold" className="text-left text-primary-normal">
            {format(selectedDate, 'do MMMM')}
          </Text>
        </View>
      </View>
      <Button
        intent="tertiary"
        loading={isLoggingOut}
        onPress={async () => {
          setIsLoggingOut(true);
          await supabase.auth.signOut();
          setIsLoggingOut(false);
        }}
      >
        {!isLoggingOut && <ArrowLeftOnRectangleIcon />}
      </Button>
    </View>
  );
}
const Header = styled(HeaderRoot);

function WeekViewRoot({ style }: { style?: ViewProps['style'] }) {
  const [selectedDay] = useState(4);

  const minX = useSharedValue(-(Dimensions.get('window').width - 58 - 12));
  const translateX = useSharedValue(minX.value / 2);

  const handleGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { x: number }>({
    onStart: (_, context) => (context.x = translateX.value),
    onActive: ({ translationX }, context) => {
      const newX = context.x + translationX;
      if (newX < 0 && newX > minX.value + 8) translateX.value = newX;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={style}>
      <PanGestureHandler onGestureEvent={handleGestureEvent}>
        <Animated.View style={animatedStyle}>
          <View className="flex-row space-x-md">
            {[...Array(9)].map((_, index) => {
              const isSelected = index === selectedDay;
              let date = new Date();
              if (index > 4) {
                date = add(date, { days: index - 4 });
              } else {
                date = sub(date, { days: 4 - index });
              }

              return (
                <StyledMotiPressable
                  key={index}
                  className={clsx(
                    'w-[58px] items-center rounded-lg py-md shadow',
                    isSelected ? 'bg-interactive-primary-normal' : 'bg-white',
                  )}
                  // onPress={() => setSelectedDay(index)}
                >
                  <Text
                    weight="medium"
                    className={clsx('text-center text-xl', isSelected ? 'text-white' : 'text-primary-normal')}
                  >
                    {format(date, 'd')}
                  </Text>
                  <Text className={clsx('text-xs', isSelected ? 'text-white' : 'text-primary-muted')}>
                    {isToday(date) ? 'Today' : format(date, 'E')}
                  </Text>
                </StyledMotiPressable>
              );
            })}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}
const WeekView = styled(WeekViewRoot);

import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import Animated, { Easing, interpolateColor, useSharedValue, withTiming } from 'react-native-reanimated';
import theme from '@podium/tailwindcss/theme';
import clsx from 'clsx';

import { styled } from 'nativewind';
import { Text } from '../typography/Text';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface LayoutProps {
  children?: React.ReactNode;
  title: string;
  titleRightSection?: React.ReactNode;
  description: string;
  removePadding?: boolean;
}

const LayoutRoot: React.FC<LayoutProps> = ({ children, title, description, titleRightSection, removePadding }) => {
  const navigation = useNavigation();
  return (
    <View className="relative flex-1 pb-base">
      <View className="px-base md:px-lg">
        <View className="mb-sm w-full flex-row items-center">
          <BackButton
            onPress={() => {
              if (navigation.canGoBack()) navigation.goBack();
            }}
          />

          <View style={{ width: 20, height: 20 }} />
        </View>

        <View className="mb-base border-b border-primary-normal pb-base">
          <View className="flex-row items-center justify-between">
            <Text weight="medium" className="text-2xl text-primary-normal">
              {title}
            </Text>

            {titleRightSection}
          </View>

          <Text className="mt-sm text-sm text-primary-muted">{description}</Text>
        </View>
      </View>
      <View className={clsx('flex-1', removePadding ? 'px-none' : 'px-base md:px-lg')}>{children}</View>
    </View>
  );
};

export const Layout = styled(LayoutRoot);

function BackButton({ onPress }: { onPress: () => void }) {
  const [isPressed, setIsPressed] = useState(false);

  const stroke = isPressed ? theme.textColor.icon.primary.active : theme.textColor.icon.primary.normal;

  return (
    <Pressable
      className="ml-[-6px] mb-[-6px] h-[42px] w-[42px] items-center justify-center"
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Svg width={36} height={36} fill="none">
        <AnimatedPath
          d="M13.875 7.125 7.125 13.5l6.75 6.375"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={stroke}
        />
        <AnimatedPath
          d="M8.25 13.5h14.625a6 6 0 0 1 6 6v9.375"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={stroke}
        />
      </Svg>
    </Pressable>
  );
}

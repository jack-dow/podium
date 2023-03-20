import React, { useState } from "react";
import { Pressable, View, type TextProps, type ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { styled } from "nativewind";
import theme from "@podium/tailwind-config/theme";

import { Text } from "../typography/Text";

const AnimatedPath = Animated.createAnimatedComponent(Path);

function LayoutRoot({ children }: { children: React.ReactNode }) {
  return <View className="relative flex-1 pt-base">{children}</View>;
}

function LayoutHeader({ children, style }: { children: React.ReactNode; style?: ViewProps["style"] }) {
  return (
    <View className="px-base md:px-lg" style={style}>
      <View className="border-b border-primary-normal pb-base">{children}</View>
    </View>
  );
}

function LayoutBackButton({ style }: { style?: ViewProps["style"] }) {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);

  const stroke = isPressed ? theme.textColor.icon.primary.active : theme.textColor.icon.primary.normal;
  return (
    <Pressable
      className="ml-[-6px] mb-[-6px] h-[42px] w-[42px] items-center justify-center pb-sm"
      style={style}
      onPress={() => {
        if (navigation.canGoBack()) navigation.goBack();
      }}
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

function LayoutTitle({ children, style }: { children: React.ReactNode; style?: TextProps["style"] }) {
  return (
    <Text weight="medium" className="text-2xl text-primary-normal" style={style}>
      {children}
    </Text>
  );
}

function LayoutDescription({ children, style }: { children: React.ReactNode; style?: TextProps["style"] }) {
  return (
    <Text className="mt-xs text-sm text-primary-muted" style={style}>
      {children}
    </Text>
  );
}

function LayoutContent({ children, style }: { children: React.ReactNode; style?: ViewProps["style"] }) {
  return (
    <View className="flex-1" style={style}>
      {children}
    </View>
  );
}

export const Layout = Object.assign(styled(LayoutRoot), {
  Header: styled(LayoutHeader),
  BackButton: styled(LayoutBackButton),
  Title: styled(LayoutTitle),
  Description: styled(LayoutDescription),
  Content: styled(LayoutContent),
});

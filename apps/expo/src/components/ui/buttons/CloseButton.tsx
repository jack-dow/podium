import type { PressableProps } from 'react-native';

import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { Easing, interpolateColor, useSharedValue, withTiming } from 'react-native-reanimated';
import theme from '@podium/tailwindcss/theme';

import { XMarkIcon } from '@/assets/icons/mini/XMark';

interface CloseButtonProps {
  /** Controls what happens when the anchor is pressed */
  onPress?: () => void;

  /** Allows button customization. Shouldn't really ever be used, only useful for space tailwind utilities */
  style: PressableProps['style'];
}

export const CloseButton: React.FC<CloseButtonProps> = ({ ...props }) => {
  const [isPressed, setIsPressed] = useState(false);

  const strokeColor = useSharedValue(0);
  const stroke = interpolateColor(
    strokeColor.value,
    [0, 1],
    [theme.textColor.icon.primary.normal, theme.textColor.icon.primary.active],
  );

  useEffect(() => {
    strokeColor.value = withTiming(isPressed ? 0 : 1, { duration: 150, easing: Easing.ease });
  }, [isPressed, strokeColor]);

  return (
    <Pressable
      className="rounded-md"
      {...props}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <XMarkIcon intent="primary" stroke={stroke} />
    </Pressable>
  );
};

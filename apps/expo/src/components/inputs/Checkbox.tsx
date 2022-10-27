import type { SxProp, Theme } from 'dripsy';
import { Pressable, Text, View, useDripsyTheme } from 'dripsy';
import { motify } from 'moti';
import { useEffect, useState } from 'react';

import Svg, { Path } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps } from 'react-native-reanimated';

const MotiView = motify(View)();
const MotiPressable = motify(Pressable)();

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onPress?: (checked: boolean) => void;
  radius?: Theme['radii'];
  label?: string;
  styles?: {
    wrapper?: SxProp;
    checkbox?: SxProp;
  };
}

export const Checkbox: React.FC<CheckboxProps> = ({
  radius = 'md',
  checked,
  indeterminate = false,
  onPress,
  label,
  styles,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(checked || false);
  const { theme } = useDripsyTheme();

  useEffect(() => {
    if (typeof checked === 'boolean' && checked !== isChecked) {
      setIsChecked(checked);
    }
  }, [isChecked, checked]);
  return (
    <View sx={{ flexDirection: 'row', alignItems: 'center', ...styles?.wrapper }}>
      <MotiPressable
        sx={{
          width: 24,
          height: 24,
          borderWidth: 1,
          borderRadius: radius,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: isChecked ? 'transparent' : 'border-primary',
          ...styles?.checkbox,
        }}
        onPress={() => {
          if (onPress) {
            onPress(!isChecked);
          }
          setIsChecked(!isChecked);
        }}
      >
        <MotiView
          animate={{
            opacity: isChecked ? 1 : 0,
            borderColor: theme.colors['border-primary-active'],
            backgroundColor: theme.colors['interactive-primary-normal'],
          }}
          transition={{
            type: 'timing',
            duration: 100,
            easing: Easing.ease,
          }}
          sx={{
            width: 24,
            height: 24,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderRadius: radius,
            opacity: 0,
          }}
        >
          <CheckIcon indeterminate={indeterminate} />
        </MotiView>
      </MotiPressable>
      {label && <Text sx={{ pl: 'md' }}>{label}</Text>}
    </View>
  );
};

interface CheckboxStateIcon {
  indeterminate: boolean;
}
const CheckIcon: React.FC<CheckboxStateIcon> = ({ indeterminate }) => {
  const animatedProps = useAnimatedProps(() => ({
    d: indeterminate
      ? 'M2 8c0-.265.053-.52.146-.707C2.24 7.105 2.367 7 2.5 7h11c.133 0 .26.105.354.293.093.187.146.442.146.707 0 .265-.053.52-.146.707-.094.188-.221.293-.354.293h-11c-.133 0-.26-.105-.354-.293A1.63 1.63 0 0 1 2 8Z'
      : 'M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0z',
  }));
  return (
    <Svg viewBox="0 0 16 16" fill="#fff" style={{ width: 16, height: 16 }}>
      <AnimatedPath animatedProps={animatedProps} />
    </Svg>
  );
};

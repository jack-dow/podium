import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import Svg, { type SvgProps } from 'react-native-svg';
import type { Theme } from '@/themes';
import { useTheme } from '@/themes';

export interface IconProps extends SvgProps {
  style?: StyleProp<ViewStyle | TextStyle>;
  variant?: keyof Theme['colors']['icon'];
  active?: boolean;
  children?: React.ReactNode;
  size?: keyof typeof sizes;
}

export const Icon: React.FC<IconProps> = ({
  children,
  active = false,
  variant = 'primary',
  style,
  size = 'base',
  ...props
}) => {
  const { icon } = useTheme().colors;

  const styles = Object.assign({ color: active ? icon[variant].active : icon[variant].normal }, style);

  return (
    <Svg {...props} style={[styles, sizes[size]]}>
      {children}
    </Svg>
  );
};

const sizes = StyleSheet.create({
  sm: {
    width: 16,
    height: 16,
  },
  md: {
    width: 20,
    height: 20,
  },
  base: {
    width: 24,
    height: 24,
  },
});

import { styled } from 'nativewind';
import type { TextStyle } from 'react-native';
import { Text as RNText, StyleSheet } from 'react-native';

interface TextProps {
  children: React.ReactNode;
  style?: TextStyle;
  /** Controls the font weight of the default Inter font-family as the default font-weight property doesn't work with custom fonts */
  weight?: keyof typeof weights;
}

const weights = StyleSheet.create({
  thin: {
    fontFamily: 'Inter-Thin',
  },
  extralight: {
    fontFamily: 'Inter-ExtraLight',
  },
  light: {
    fontFamily: 'Inter-Light',
  },
  normal: {
    fontFamily: 'Inter',
  },
  medium: {
    fontFamily: 'Inter-Medium',
  },
  semibold: {
    fontFamily: 'Inter-SemiBold',
  },
  bold: {
    fontFamily: 'Inter-Bold',
  },
  extrabold: {
    fontFamily: 'Inter-ExtraBold',
  },
  black: {
    fontFamily: 'Inter-Black',
  },
});

export function TextRoot({ children, weight = 'normal', style }: TextProps) {
  return <RNText style={[style, weights[weight]]}>{children}</RNText>;
}

export const Text = styled(TextRoot);

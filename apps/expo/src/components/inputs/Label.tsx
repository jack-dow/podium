import React from 'react';
import type { StylesAsProp } from 'react-native';
import { Text } from 'react-native';
import type { Theme } from '@/themes';
import { useTheme } from '@/themes';

export interface LabelProps {
  children?: React.ReactNode;
  size?: keyof Theme['fontSizes'];
  style?: StylesAsProp;
}

export const Label: React.FC<LabelProps> = ({ children, size = 'sm', style }) => {
  const { fontSizes, fontWeights, colors, lineHeights } = useTheme();
  return (
    <Text
      style={[
        {
          fontSize: fontSizes[size],
          fontWeight: fontWeights.semibold,
          color: colors.text.primary.normal,
          lineHeight: lineHeights.lg,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

Label.displayName = 'Label';

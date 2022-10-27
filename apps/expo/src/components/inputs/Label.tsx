import React from 'react';
import type { SxProp, Theme } from 'dripsy';
import { Text } from 'dripsy';

export interface LabelProps {
  children?: React.ReactNode;
  sx?: SxProp;
  size?: keyof Theme['fontSizes'];
}

export const Label: React.FC<LabelProps> = ({ children, size = 'sm', sx }) => {
  return (
    <Text
      variant={size}
      sx={{
        fontWeight: 'semibold',
        color: 'text-normal',
        lineHeight: 24,
        ...sx,
      }}
    >
      {children}
    </Text>
  );
};

Label.displayName = 'Label';

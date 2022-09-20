import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Text } from 'react-native';

export interface LabelProps {
  children?: React.ReactNode;
  visuallyHidden?: boolean;
}

export const Label = forwardRef<Text, LabelProps>(({ children, visuallyHidden = false, ...props }, ref) => {
  return (
    <Text
      ref={ref}
      {...props}
      className={clsx('block select-none text-sm font-semibold leading-6 text-gray-900', visuallyHidden && 'sr-only')}
    >
      {children}
    </Text>
  );
});

Label.displayName = 'Label';

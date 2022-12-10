import type { TextInputProps, ViewProps } from 'react-native';

import { forwardRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { styled } from 'nativewind';
import clsx from 'clsx';
import theme from '@podium/tailwindcss/theme';

import { Text } from '../typography/Text';
import { ExclamationCircleIcon } from '@/assets/icons/mini/ExclamationCircle';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Controls the invalid state of the input */
  invalid?: boolean;

  // leftIcon?: React.ReactNode

  /** Adds an icon to the right side of the input */
  rightIcon?: React.ReactNode;

  /** Allows button customization. Shouldn't really ever be used, only useful for space tailwind utilities */
  style?: ViewProps['style'];
}

const InputRoot = forwardRef<TextInput, InputProps>(({ invalid, rightIcon, style, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="relative rounded-md shadow-sm" style={style}>
      <TextInput
        ref={ref}
        {...props}
        className={clsx(
          'w-full rounded-md border bg-white py-sm pl-sm text-sm',
          rightIcon || invalid ? 'pr-[40px]' : 'pr-base',
          invalid ? 'text-danger-normal' : 'text-primary-normal',
          isFocused && invalid
            ? 'border-danger-active'
            : !isFocused && invalid
            ? 'border-danger-normal'
            : isFocused
            ? 'border-primary-active'
            : 'border-primary-normal',
          props.multiline ? 'align-top' : 'align-middle',
        )}
        onBlur={(e) => {
          if (props?.onBlur) props.onBlur(e);
          setIsFocused(false);
        }}
        onFocus={(e) => {
          if (props?.onFocus) props.onFocus(e);
          setIsFocused(true);
        }}
        placeholderTextColor={invalid ? theme.placeholderColor.danger : theme.placeholderColor.normal}
      />

      <View className="absolute inset-y-none right-none items-center pr-md">
        {invalid && !rightIcon && <ExclamationCircleIcon intent="danger" />}
        {rightIcon}
      </View>
    </View>
  );
});

InputRoot.displayName = 'Input';

const ErrorText = ({ children }: { children: string }) => (
  <Text className="mt-xs text-xs text-danger-normal">{children}</Text>
);

export const Input = Object.assign(styled(InputRoot), { ErrorText: styled(ErrorText) });

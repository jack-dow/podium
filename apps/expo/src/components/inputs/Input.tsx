import clsx from 'clsx';
import { forwardRef } from 'react';
import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';

export interface InputProps extends TextInputProps {
  invalid?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({ invalid, ...props }, ref) => {
  return (
    <View className="relative">
      <TextInput
        ref={ref}
        {...props}
        className={clsx(
          'w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-slate-900 shadow-sm transition duration-100',
          'focus:border-sky-600',
          invalid && 'border-red-500',
          'sm:text-sm',
        )}
      />
    </View>
  );
});

Input.displayName = 'Input';

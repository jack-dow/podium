import { forwardRef } from 'react';
import type { TextInput as RNTextInput } from 'react-native';
import { View } from 'react-native';
import type { InputProps } from './Input';
import { Input } from './Input';
import { Label } from './Label';

interface PasswordInputProps extends InputProps {
  label: string;
  labelHidden?: boolean;
}

export const PasswordInput = forwardRef<RNTextInput, PasswordInputProps>(({ label, labelHidden, ...props }, ref) => {
  return (
    <View className="space-y-1">
      <Label visuallyHidden={labelHidden}>{label}</Label>
      <Input
        ref={ref}
        {...props}
        autoComplete="password"
        keyboardType="visible-password"
        textContentType="password"
        accessibilityLabel="password"
      />
    </View>
  );
});

PasswordInput.displayName = 'TextInput';

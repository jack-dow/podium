import { forwardRef } from 'react';
import type { TextInput as RNTextInput } from 'react-native';
import { View } from 'react-native';
import type { InputProps } from './Input';
import { Input } from './Input';
import { Label } from './Label';

interface EmailInputProps extends InputProps {
  label: string;
  labelHidden?: boolean;
}

export const EmailInput = forwardRef<RNTextInput, EmailInputProps>(({ label, labelHidden, ...props }, ref) => {
  return (
    <View className="space-y-1">
      <Label visuallyHidden={labelHidden}>{label}</Label>
      <Input
        ref={ref}
        {...props}
        autoComplete="email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
    </View>
  );
});

EmailInput.displayName = 'TextInput';

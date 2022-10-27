import { forwardRef } from 'react';
import type { TextInput as RNTextInput } from 'react-native';
import type { InputProps } from './Input';
import { Input } from './Input';

interface EmailInputProps extends InputProps {}

export const EmailInput = forwardRef<RNTextInput, EmailInputProps>(({ ...props }, ref) => {
  return (
    <Input
      ref={ref}
      {...props}
      autoComplete="email"
      autoCapitalize="none"
      keyboardType="email-address"
      textContentType="emailAddress"
    />
  );
});

EmailInput.displayName = 'TextInput';

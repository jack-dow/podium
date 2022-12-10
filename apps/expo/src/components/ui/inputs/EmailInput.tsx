import type { TextInput as RNTextInput } from 'react-native';

import { forwardRef } from 'react';
import { styled } from 'nativewind';

import type { InputProps } from './Input';

import { Input } from './Input';

interface EmailInputProps extends InputProps {}

const EmailInputRoot = forwardRef<RNTextInput, EmailInputProps>(({ ...props }, ref) => {
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

EmailInputRoot.displayName = 'TextInput';

export const EmailInput = Object.assign(styled(EmailInputRoot), { ErrorText: Input.ErrorText });

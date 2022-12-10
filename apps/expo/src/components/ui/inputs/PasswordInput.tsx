import type { TextInput as RNTextInput } from 'react-native';

import { forwardRef, useState } from 'react';
import { Pressable } from 'react-native';
import { styled } from 'nativewind';

import type { InputProps } from './Input';

import { Input } from './Input';
import { EyeIcon } from '@/assets/icons/mini/Eye';
import { EyeSlashIcon } from '@/assets/icons/mini/EyeSlash';

interface PasswordInputProps extends InputProps {}

const PasswordInputRoot = forwardRef<RNTextInput, PasswordInputProps>(({ invalid, ...props }, ref) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  return (
    <Input
      ref={ref}
      {...props}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="password"
      textContentType="password"
      accessibilityLabel="password"
      secureTextEntry={passwordVisible}
      invalid={invalid}
      enablesReturnKeyAutomatically
      rightIcon={
        <Pressable onPress={() => setPasswordVisible(!passwordVisible)} className="flex-1 justify-center">
          {passwordVisible ? (
            <EyeSlashIcon intent={invalid ? 'danger' : 'primary'} />
          ) : (
            <EyeIcon intent={invalid ? 'danger' : 'primary'} />
          )}
        </Pressable>
      }
    />
  );
});

PasswordInputRoot.displayName = 'TextInput';

export const PasswordInput = Object.assign(styled(PasswordInputRoot), { ErrorText: Input.ErrorText });

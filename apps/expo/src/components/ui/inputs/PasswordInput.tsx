import { forwardRef, useState } from 'react';
import type { TextInput as RNTextInput } from 'react-native';
import { Pressable } from 'react-native';
import type { InputProps } from './Input';
import { Input } from './Input';
import { EyeIcon } from '@/assets/icons/mini/Eye';
import { EyeSlashIcon } from '@/assets/icons/mini/EyeSlash';

interface PasswordInputProps extends InputProps {}

export const PasswordInput = forwardRef<RNTextInput, PasswordInputProps>(({ invalid, ...props }, ref) => {
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
        <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
          {({ pressed }) => {
            if (passwordVisible) {
              return <EyeSlashIcon variant={invalid ? 'danger' : 'primary'} active={pressed} />;
            } else {
              return <EyeIcon variant={invalid ? 'danger' : 'primary'} active={pressed} />;
            }
          }}
        </Pressable>
      }
    />
  );
});

PasswordInput.displayName = 'TextInput';

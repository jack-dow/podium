import { forwardRef, useState } from 'react';
import type { TextInput as RNTextInput } from 'react-native';
import { Pressable } from 'react-native';
import clsx from 'clsx';
import type { InputProps } from './Input';
import { Input } from './Input';
import { EyeIcon } from '@/assets/icons/mini/Eye';
import { EyeSlashIcon } from '@/assets/icons/mini/EyeSlash';

interface PasswordInputProps extends InputProps {}

export const PasswordInput = forwardRef<RNTextInput, PasswordInputProps>(({ ...props }, ref) => {
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
      enablesReturnKeyAutomatically
      rightIcon={
        <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
          {passwordVisible ? (
            <EyeSlashIcon className={clsx(props.invalid ? 'text-red-600' : 'text-slate-900')} />
          ) : (
            <EyeIcon className={clsx(props.invalid ? 'text-red-600' : 'text-slate-900')} />
          )}
        </Pressable>
      }
    />
  );
});

PasswordInput.displayName = 'TextInput';

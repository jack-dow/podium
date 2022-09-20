import { forwardRef } from 'react';
import type { TextInput as RNTextInput } from 'react-native';
import { View } from 'react-native';
import type { InputProps } from './Input';
import { Input } from './Input';
import { Label } from './Label';

interface TextInputProps extends InputProps {
  label: string;
  labelHidden?: boolean;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(({ label, labelHidden, ...props }, ref) => {
  return (
    <View className="space-y-1">
      <Label visuallyHidden={labelHidden}>{label}</Label>
      <Input ref={ref} {...props} />
    </View>
  );
});

TextInput.displayName = 'TextInput';

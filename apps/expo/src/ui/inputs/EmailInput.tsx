import { forwardRef } from "react";
import type { TextInput as RNTextInput } from "react-native";
import { styled } from "nativewind";

import { Input, type InputProps } from "./Input";

const EmailInputRoot = forwardRef<RNTextInput, InputProps>(({ ...props }, ref) => {
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

EmailInputRoot.displayName = "TextInput";

export const EmailInput = Object.assign(styled(EmailInputRoot), { ErrorText: Input.ErrorText });

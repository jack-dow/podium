/// <reference types="nativewind/types" />
import 'react-native';

declare module 'react-native' {
  type AllowedStyleProps<T> = T | RegisteredStyle<T>;
  export type StylesAsProp = AllowedStyleProps<ViewStyle | TextStyle | ImageStyle>;
  export type ViewStylesAsProp = AllowedStyleProps<ViewStyle>;
  export type TextStylesAsProp = AllowedStyleProps<TextStyle>;
  export type ImageStylesAsProp = AllowedStyleProps<ImageStyle>;
}

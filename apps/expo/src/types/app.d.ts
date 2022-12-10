/// <reference types="nativewind/types" />
import 'react-native';
import type { VariantProps } from 'nativewind';

declare module 'react-native' {
  type AllowedStyleProps<T> = T | RegisteredStyle<T>;
  export type StylesAsProp = AllowedStyleProps<ViewStyle | TextStyle | ImageStyle>;
  export type ViewStylesAsProp = AllowedStyleProps<ViewStyle>;
  export type TextStylesAsProp = AllowedStyleProps<TextStyle>;
  export type ImageStylesAsProp = AllowedStyleProps<ImageStyle>;
}

declare module 'nativewind' {
  type ExpandRecursively<T> = T extends object
    ? T extends infer O
      ? { [K in keyof O]: ExpandRecursively<O[K]> }
      : never
    : T;

  type RemoveNull<T> = ExpandRecursively<{ [K in keyof T]: Exclude<RemoveNull<T[K]>, null> }>;

  export type VariantPropsWithoutNull<T> = RemoveNull<VariantProps<T>>;
}

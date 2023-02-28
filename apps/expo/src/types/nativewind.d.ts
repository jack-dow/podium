/// <reference types="nativewind/types" />
import type { VariantProps } from "nativewind";

declare module "nativewind" {
  type ExpandRecursively<T> = T extends object
    ? T extends infer O
      ? { [K in keyof O]: ExpandRecursively<O[K]> }
      : never
    : T;

  type RemoveNull<T> = ExpandRecursively<{
    [K in keyof T]: Exclude<RemoveNull<T[K]>, null>;
  }>;

  export type VariantPropsWithoutNull<T> = RemoveNull<VariantProps<T>>;
}

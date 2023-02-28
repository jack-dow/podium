import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from "react-native";
import { styled } from "nativewind";

export interface TextProps extends RNTextProps {
  /** Children must be passed to a text component */
  children: React.ReactNode;

  /** Controls the font weight of the default Inter font-family as the default font-weight property doesn't work with custom fonts */
  weight?: TextWeights;

  /** Allows text customization. Shouldn't really ever be used, only useful for space tailwind utilities */
  style?: RNTextProps["style"];
}

export type TextWeights = keyof typeof weights;

const weights = StyleSheet.create({
  thin: {
    fontFamily: "Inter-Thin",
  },
  extralight: {
    fontFamily: "Inter-ExtraLight",
  },
  light: {
    fontFamily: "Inter-Light",
  },
  normal: {
    fontFamily: "Inter",
  },
  medium: {
    fontFamily: "Inter-Medium",
  },
  semibold: {
    fontFamily: "Inter-SemiBold",
  },
  bold: {
    fontFamily: "Inter-Bold",
  },
  extrabold: {
    fontFamily: "Inter-ExtraBold",
  },
  black: {
    fontFamily: "Inter-Black",
  },
});

export function TextRoot({ children, weight = "normal", style }: TextProps) {
  return <RNText style={[style, weights[weight]]}>{children}</RNText>;
}

export const Text = styled(TextRoot);

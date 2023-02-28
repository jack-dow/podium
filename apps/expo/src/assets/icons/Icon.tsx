import type { ViewProps } from "react-native";
import Svg, { type SvgProps } from "react-native-svg";
import clsx from "clsx";
import { styled, variants, type VariantProps } from "nativewind";

const iconVariants = variants({
  variants: {
    intent: {
      primary: "text-icon-primary-normal",
      positive: "text-icon-positive-normal",
      warning: "text-icon-warning-normal",
      danger: "text-icon-danger-normal",
      info: "text-icon-info-normal",
    },
    size: {
      sm: "w-base h-base",
      md: "w-[20px] h-[20px]",
      base: "w-lg h-lg",
    },
    muted: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      intent: "primary",
      muted: true,
      className: "text-icon-primary-muted",
    },
    {
      intent: "positive",
      muted: true,
      className: "text-icon-positive-muted",
    },
    {
      intent: "warning",
      muted: true,
      className: "text-icon-warning-muted",
    },
    {
      intent: "danger",
      muted: true,
      className: "text-icon-danger-muted",
    },
    {
      intent: "info",
      muted: true,
      className: "text-icon-info-muted",
    },
  ],
});

type IconVariants = VariantProps<typeof iconVariants>;

export interface IconProps extends SvgProps {
  /** Applies custom styles to the icon */
  style?: ViewProps["style"];

  /** Controls the icon color */
  intent?: IconVariants["intent"];

  /** Controls the icon size */
  size?: IconVariants["size"];

  /** Controls the icon color whether it's normal or muted */
  muted?: IconVariants["muted"];
}

const IconRoot: React.FC<React.PropsWithChildren<IconProps>> = ({
  children,
  intent = "primary",
  size = "base",
  muted,
  ...props
}) => {
  const className = iconVariants({ intent, size, muted });
  return (
    <Svg {...props} className={clsx(className)}>
      {children}
    </Svg>
  );
};

export const Icon = styled(IconRoot);

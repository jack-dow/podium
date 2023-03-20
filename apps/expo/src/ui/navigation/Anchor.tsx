import { Pressable, type PressableProps } from "react-native";
import clsx from "clsx";
import { styled, variants, type VariantPropsWithoutNull } from "nativewind";

import { Text } from "../typography/Text";

const anchorVariants = variants({
  variants: {
    intent: {
      primary: "text-interactive-primary-normal",
      danger: "text-interactive-danger-normal",
    },
    active: {
      true: "underline",
      false: "no-underline",
    },
  },
  compoundVariants: [
    {
      intent: "primary",
      active: true,
      className: "text-interactive-primary-active",
    },
    {
      intent: "danger",
      active: true,
      className: "text-interactive-danger-active",
    },
  ],
});

type AnchorVariants = VariantPropsWithoutNull<typeof anchorVariants>;

interface AnchorProps {
  /** Controls what happens when the anchor is pressed */
  onPress?: () => void;

  /** Controls the anchor intent */
  intent?: AnchorVariants["intent"];

  /** Link label */
  children: string;

  /** Allows button customization. Shouldn't really ever be used, only useful for space tailwind utilities */
  style?: PressableProps["style"];
}

const AnchorRoot: React.FC<AnchorProps> = ({ children, intent = "primary", ...props }) => {
  return (
    <Pressable {...props} className="focus:underline">
      {({ pressed }) => {
        const className = anchorVariants({ intent, active: pressed });
        return (
          <Text weight="medium" className={clsx("text-sm", className)}>
            {children}
          </Text>
        );
      }}
    </Pressable>
  );
};

AnchorRoot.displayName = "Anchor";

export const Anchor = styled(AnchorRoot);

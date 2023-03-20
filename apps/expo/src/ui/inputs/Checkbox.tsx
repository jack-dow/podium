import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { Easing, useAnimatedProps } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import clsx from "clsx";
import { MotiView } from "moti";
import { MotiPressable } from "moti/interactions";
import { styled, variants, type VariantPropsWithoutNull } from "nativewind";
import theme from "@podium/tailwind-config/theme";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const StyledMotiPressable = styled(MotiPressable);

const checkboxVariants = variants({
  variants: {
    sizes: {
      sm: "w-[20px] h-[20px]",
      md: "w-lg h-lg",
    },
  },
});

type CheckboxVariants = VariantPropsWithoutNull<typeof checkboxVariants>;

interface CheckboxProps {
  /** Controls the checkbox checked state */
  checked?: boolean;

  /** Controls the checkbox indeterminate state */
  indeterminate?: boolean;

  /** Controls what happens when the anchor is pressed */
  onPress?: (checked: boolean) => void;

  /** Controls the button size */
  size?: CheckboxVariants["sizes"];
}

const CheckboxRoot: React.FC<CheckboxProps> = ({ checked, indeterminate = false, onPress, size = "md" }) => {
  const [isChecked, setIsChecked] = useState(checked || false);
  const className = checkboxVariants({ sizes: size });

  useEffect(() => {
    if (typeof checked === "boolean" && checked !== isChecked) {
      setIsChecked(checked);
    }
  }, [isChecked, checked]);

  return (
    <View className="flex-row items-center">
      <StyledMotiPressable
        className={clsx(
          "items-center justify-center rounded-md border",
          isChecked ? "border-transparent" : "border-primary-normal",
          className,
        )}
        onPress={() => {
          if (onPress) {
            onPress(!isChecked);
          }
          setIsChecked(!isChecked);
        }}
      >
        <MotiView
          animate={{
            opacity: isChecked ? 1 : 0,
            borderColor: theme.borderColor.interactive.primary.normal,
            backgroundColor: theme.backgroundColor.interactive.primary.normal,
          }}
          transition={{
            type: "timing",
            duration: 100,
            easing: Easing.ease,
          }}
          className={clsx("items-center justify-center rounded-md border opacity-0", className)}
        >
          <CheckIcon indeterminate={indeterminate} />
        </MotiView>
      </StyledMotiPressable>
    </View>
  );
};

interface CheckboxStateIcon {
  indeterminate: boolean;
}
const CheckIcon: React.FC<CheckboxStateIcon> = ({ indeterminate }) => {
  const animatedProps = useAnimatedProps(() => ({
    d: indeterminate
      ? "M2 8c0-.265.053-.52.146-.707C2.24 7.105 2.367 7 2.5 7h11c.133 0 .26.105.354.293.093.187.146.442.146.707 0 .265-.053.52-.146.707-.094.188-.221.293-.354.293h-11c-.133 0-.26-.105-.354-.293A1.63 1.63 0 0 1 2 8Z"
      : "M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0z",
  }));
  return (
    <Svg viewBox="0 0 16 16" fill="#fff" className="h-base w-base">
      <AnimatedPath animatedProps={animatedProps} />
    </Svg>
  );
};

export const Checkbox = styled(CheckboxRoot);

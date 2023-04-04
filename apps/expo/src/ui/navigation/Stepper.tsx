import React, { Children, cloneElement } from "react";
import { Pressable, View, type ViewProps } from "react-native";
import clsx from "clsx";
import { styled } from "nativewind";

import { Text } from "../typography/Text";

type StepperProps = {
  /** <Stepper.Step /> components only */
  children: React.ReactNode;

  /** Active step index */
  active: number;

  /** Allows step customization. Shouldn't really ever be used, only added for space tailwind utilities */
  style?: ViewProps["style"];
};

function StepperRoot({ children, active, style }: StepperProps) {
  const convertedChildren = Children.toArray(children) as React.ReactElement[];
  const _children = convertedChildren.filter((child) => child.type !== Step);

  const steps = _children.reduce<React.ReactElement[]>((acc, child, index) => {
    acc.push(
      cloneElement(child, {
        state: active === index ? "stepProgress" : active > index ? "stepCompleted" : "stepInactive",
      }),
    );

    return acc;
  }, []);

  return (
    <View style={style} className="flex-row">
      {steps}
    </View>
  );
}

interface StepProps {
  /** Step order */
  index?: number;

  /** Step state, controlled by Steps component */
  state?: "stepInactive" | "stepProgress" | "stepCompleted";

  /** Should step selection be allowed */
  allowStepSelect?: boolean;

  /** What happens when the step is pressed */
  onPress?: () => void;

  /** Allows step customization. Shouldn't really ever be used, only added for space tailwind utilities */
  style?: ViewProps["style"];

  /** Step label */
  children: React.ReactNode;
}

function Step({ state = "stepInactive", index = 0, onPress, children, allowStepSelect, style }: StepProps) {
  return (
    <View style={style} className="flex-1">
      <Pressable
        onPress={onPress}
        disabled={!allowStepSelect}
        className={clsx(
          "w-full border-t-4 pt-base",
          state === "stepCompleted" || state === "stepProgress" ? "border-primary-active" : "border-primary-normal",
          state === "stepInactive" && !allowStepSelect ? "opacity-30" : "opacity-100",
        )}
      >
        {({ pressed }) => {
          return (
            <>
              <Text
                weight="bold"
                className={clsx(
                  "text-sm uppercase",
                  state === "stepCompleted" || state === "stepProgress"
                    ? "text-interactive-primary-normal"
                    : pressed
                    ? "text-interactive-primary-active"
                    : "text-primary-muted",
                )}
              >
                Step {index + 1}
              </Text>
              <Text weight="medium" className="text-sm">
                {children}
              </Text>
            </>
          );
        }}
      </Pressable>
    </View>
  );
}

export const Stepper = Object.assign(styled(StepperRoot), { Step: styled(Step) });

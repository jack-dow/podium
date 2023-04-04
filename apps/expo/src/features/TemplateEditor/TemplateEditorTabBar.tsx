// This file only exists to prevent a require cycle from occurring
import { View } from "react-native";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { proxy, useSnapshot } from "valtio";

import { Stepper } from "~/ui";

export const templateEditorStepsCompleteProxy = proxy({
  stepsComplete: 0,
});

export const TemplateEditorTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { stepsComplete } = useSnapshot(templateEditorStepsCompleteProxy);

  return (
    <View className="mt-sm px-base pb-base">
      <Stepper active={state.index} className="space-x-md">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]!;
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : typeof options.title === "string"
              ? options.title
              : route.name;

          return (
            <Stepper.Step
              onPress={() => navigation.navigate(route.name)}
              key={index}
              index={index}
              allowStepSelect={stepsComplete >= index}
            >
              {label}
            </Stepper.Step>
          );
        })}
      </Stepper>
    </View>
  );
};

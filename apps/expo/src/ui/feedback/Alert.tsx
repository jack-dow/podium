import React, { createContext, useContext } from "react";
import { View, type ViewProps } from "react-native";
import clsx from "clsx";
import { styled, variants, type VariantPropsWithoutNull } from "nativewind";

import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from "~/assets/icons/mini";
import { Text, type TextWeights } from "../typography/Text";

const alertVariants = variants({
  variants: {
    intent: {
      positive: "bg-positive",
      warning: "bg-warning",
      danger: "bg-danger",
      info: "bg-info",
    },
  },
});

type AlertVariants = VariantPropsWithoutNull<typeof alertVariants>;

interface AlertProps {
  /** Controls alert appearance */
  intent: AlertVariants["intent"];

  /** Replaces the default icon */
  icon?: React.ReactNode;

  /** Allows alert customization. Shouldn't really ever be used, only useful for space tailwind utilities */
  style?: ViewProps["style"];
}

type AlertContextProps = Required<Pick<AlertProps, "intent">>;

const AlertContext = createContext<AlertContextProps | null>(null);

const AlertRoot: React.FC<React.PropsWithChildren<AlertProps>> = ({ intent, icon, children }) => {
  const className = alertVariants({ intent });
  return (
    <AlertContext.Provider value={{ intent }}>
      <View className={clsx("flex-row rounded-md p-base", className)}>
        <View>
          {icon || (
            <>
              {intent === "positive" && <CheckCircleIcon intent="positive" />}
              {intent === "warning" && <ExclamationTriangleIcon intent="warning" />}
              {intent === "danger" && <XCircleIcon intent="danger" />}
              {intent === "info" && <InformationCircleIcon intent="info" />}
            </>
          )}
        </View>
        <View className="ml-md">{children}</View>
      </View>
    </AlertContext.Provider>
  );
};

const Title: React.FC<{ children: React.ReactNode; weight?: TextWeights }> = ({ children, weight = "medium" }) => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("[Alert] Alert.Title was used outside of an Alert. Please fix this.");
  }
  return (
    <Text
      weight={weight}
      className={clsx("text-sm", {
        "text-positive-dark": context.intent === "positive",
        "text-warning-dark": context.intent === "warning",
        "text-danger-dark": context.intent === "danger",
        "text-info-dark": context.intent === "info",
      })}
    >
      {children}
    </Text>
  );
};

const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => <View className="mt-sm">{children}</View>;

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("[Alert] Alert.ListItem was used outside of an Alert. Please fix this.");
  }

  return (
    <View className="flex-row">
      <Text
        className={clsx("text-sm", {
          "text-positive-muted": context.intent === "positive",
          "text-warning-muted": context.intent === "warning",
          "text-danger-muted": context.intent === "danger",
          "text-info-muted": context.intent === "info",
        })}
      >
        {"\u2022"}
      </Text>
      <Text
        className={clsx("pl-md text-sm", {
          "text-positive-muted": context.intent === "positive",
          "text-warning-muted": context.intent === "warning",
          "text-danger-muted": context.intent === "danger",
          "text-info-muted": context.intent === "info",
        })}
      >
        {children}
      </Text>
    </View>
  );
};

const Description: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("[Alert] Alert.Description was used outside of an Alert. Please fix this.");
  }
  return (
    <Text
      className={clsx("text-sm", {
        "text-positive-muted": context.intent === "positive",
        "text-warning-muted": context.intent === "warning",
        "text-danger-muted": context.intent === "danger",
        "text-info-muted": context.intent === "info",
      })}
    >
      {children}
    </Text>
  );
};

const AlertWithClassName = styled(AlertRoot);
export const Alert = Object.assign(AlertWithClassName, { ListItem, Description, Title, Content: styled(Content) });

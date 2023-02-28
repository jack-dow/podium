import { styled } from "nativewind";

import { Icon, type IconProps } from "./Icon";

export const SolidIcon = (iconName: string, children: React.ReactNode) => {
  const SolidIconComponent = ({ ...props }: IconProps) => {
    return (
      <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
        {children}
      </Icon>
    );
  };
  SolidIconComponent.displayName = `${iconName}Solid`;
  return styled(SolidIconComponent);
};

import { styled } from "nativewind";

import { Icon, type IconProps } from "./Icon";

export const OutlineIcon = (iconName: string, children: React.ReactNode) => {
  const OutlineIconComponent = ({ ...props }: IconProps) => {
    return (
      <Icon viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" {...props}>
        {children}
      </Icon>
    );
  };
  OutlineIconComponent.displayName = `${iconName}Outline`;
  return styled(OutlineIconComponent);
};

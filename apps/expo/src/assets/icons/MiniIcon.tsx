import { styled } from "nativewind";

import { Icon, type IconProps } from "./Icon";

export const MiniIcon = (iconName: string, children: React.ReactNode) => {
  const MiniIconComponent = ({ size = "md", ...props }: IconProps) => {
    return (
      <Icon viewBox="0 0 20 20" fill="currentColor" {...props} size={size}>
        {children}
      </Icon>
    );
  };
  MiniIconComponent.displayName = `${iconName}Mini`;
  return styled(MiniIconComponent);
};

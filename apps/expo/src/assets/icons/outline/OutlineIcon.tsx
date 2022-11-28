import { Icon, type IconProps } from '../Icon';

export const OutlineIcon = (iconName: string, children: React.ReactNode) => {
  const icon = ({ ...props }: Omit<IconProps, 'children' | 'style'>) => {
    return (
      <Icon
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
        style={{ width: 24, height: 24 }}
      >
        {children}
      </Icon>
    );
  };
  icon.displayName = `${iconName}Outline`;
  return icon;
};

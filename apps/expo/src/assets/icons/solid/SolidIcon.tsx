import { Icon, type IconProps } from '../Icon';

export const SolidIcon = (iconName: string, children: React.ReactNode) => {
  const icon = ({ ...props }: Omit<IconProps, 'children' | 'style'>) => {
    return (
      <Icon viewBox="0 0 24 24" fill="currentColor" {...props} style={{ width: 24, height: 24 }}>
        {children}
      </Icon>
    );
  };
  icon.displayName = `${iconName}Solid`;
  return icon;
};

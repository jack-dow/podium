import { Icon, type IconProps } from '../Icon';

export const MiniIcon = (iconName: string, children: React.ReactNode) => {
  const icon = ({ size = 'md', ...props }: Omit<IconProps, 'children' | 'style'>) => {
    return (
      <Icon viewBox="0 0 20 20" fill="currentColor" {...props} size={size}>
        {children}
      </Icon>
    );
  };
  icon.displayName = `${iconName}Mini`;
  return icon;
};

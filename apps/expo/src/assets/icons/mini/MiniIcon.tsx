import type { SxProp } from 'dripsy';
import { DripsySvg } from '../DripsySvg';

export const MiniIcon = (iconName: string, children: React.ReactNode) => {
  const icon = ({ sx }: { sx?: SxProp }) => {
    return (
      <DripsySvg
        viewBox="0 0 20 20"
        fill="currentColor"
        sx={{
          width: 20,
          height: 20,
          ...sx,
        }}
      >
        {children}
      </DripsySvg>
    );
  };
  icon.displayName = `${iconName}Mini`;
  return icon;
};

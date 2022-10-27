import type { SxProp } from 'dripsy';
import { DripsySvg } from '../DripsySvg';

export const SolidIcon = (iconName: string, children: React.ReactNode) => {
  const icon = ({ sx }: { sx?: SxProp }) => {
    return (
      <DripsySvg
        viewBox="0 0 24 24"
        fill="currentColor"
        sx={{
          width: 24,
          height: 24,
          ...sx,
        }}
      >
        {children}
      </DripsySvg>
    );
  };
  icon.displayName = `${iconName}Solid`;
  return icon;
};

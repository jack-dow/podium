import type { SxProp } from 'dripsy';
import { DripsySvg } from '../DripsySvg';

export const OutlineIcon = (iconName: string, children: React.ReactNode) => {
  const icon = ({ sx }: { sx?: SxProp }) => {
    return (
      <DripsySvg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.5}
        stroke="currentColor"
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
  icon.displayName = `${iconName}Outline`;
  return icon;
};

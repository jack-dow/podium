import { Dimensions } from 'react-native';

const breakpoints = {
  base: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

interface RequiredProps {
  base: number | string | boolean | undefined;
}

type OptionalProps = {
  [K in keyof typeof breakpoints]?: number | string | boolean | undefined;
};

type ResponsiveProps = RequiredProps & OptionalProps;

export const responsive = <T extends ResponsiveProps>({ base, sm, md, lg, xl }: T): T[keyof T] => {
  const { width } = Dimensions.get('window');
  if (width < breakpoints.sm) {
    return base as T[keyof T];
  }
  if (width < breakpoints.md) {
    return (sm || base) as T[keyof T];
  }
  if (width < breakpoints.lg) {
    return (md || sm || base) as T[keyof T];
  }
  if (width < breakpoints.xl) {
    return (lg || md || sm || base) as T[keyof T];
  }
  if (width > breakpoints.lg) {
    return (xl || lg || md || sm || base) as T[keyof T];
  }
  return base as T[keyof T];
};

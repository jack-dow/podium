import { createContext, useContext } from 'react';
import tw from 'tailwindcss/colors';

const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
} as const;

const fontSizes = {
  'xs': 12,
  'sm': 14,
  'md': 16,
  'lg': 18,
  'xl': 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

const fonts = {
  thin: 'InterThin',
  extralight: 'InterExtraLight',
  light: 'InterLight',
  normal: 'Inter',
  default: 'Inter',
  medium: 'InterMedium',
  semibold: 'InterSemiBold',
  bold: 'InterBold',
  extrabold: 'InterExtraBold',
  black: 'InterBlack',
} as const;

const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  default: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

const letterSpacings = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

const lineHeights = {
  'xs': 12,
  'sm': 16,
  'md': 20,
  'lg': 24,
  'xl': 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,

  'none': 1,
  'tight': 1.25,
  'snug': 1.375,
  'normal': 1.5,
  'relaxed': 1.625,
  'loose': 2,
} as const;

const radii = {
  'none': 0,
  'sm': 2,
  'base': 4,
  'md': 6,
  'lg': 8,
  'xl': 12,
  '2xl': 16,
  '3xl': 24,
  'full': 999,
} as const;

const zIndices = {
  modal: 30,
  popover: 40,
  overlay: 50,
  max: 999,
} as const;

const borderWeights = {
  light: 1,
  normal: 2,
  bold: 3,
  extrabold: 4,
  black: 5,
} as const;

const lightColors = {
  white: tw.white,
  black: tw.black,
  transparent: 'transparent',

  background: {
    primary: tw.zinc[50], // zinc-50
    secondary: tw.white, // white
    tertiary: tw.zinc[100], // zinc-100
    positive: tw.emerald[50], // emerald-50
    warning: tw.amber[50], // amber-50
    danger: tw.red[50], // red-50
    info: tw.blue[50], // blue-50
    overlay: 'rgba(113, 113, 122, 0.75)', // zinc-500 0.75 opacity
  },

  sets: {
    warmup: {
      background: tw.amber[100],
      text: tw.amber[800],
    },
    working: {
      background: tw.zinc[100],
      text: tw.zinc[800],
    },
    failure: {
      background: tw.rose[100],
      text: tw.rose[800],
    },
    dropset: {
      background: tw.indigo[100],
      text: tw.indigo[800],
    },
    backoff: {
      background: tw.fuchsia[100],
      text: tw.fuchsia[800],
    },
    cooldown: {
      background: tw.sky[100],
      text: tw.sky[800],
    },
  },

  border: {
    divider: tw.zinc[300], // zinc-300
    primary: {
      normal: tw.zinc[300], // zinc-300
      active: tw.sky[600], // sky-600
    },
    danger: {
      normal: tw.red[600], // red-600
      active: tw.red[800], // red-800
    },
  },

  placeholder: {
    normal: tw.slate[400], // slate-400,
    danger: tw.red[300], // red-300
  },

  text: {
    primary: {
      normal: tw.zinc[900], // zinc-900
      muted: tw.zinc[500], // zinc-500
    },
    positive: {
      normal: tw.emerald[800], // emerald-800
      muted: tw.emerald[700], // emerald-700
    },
    warning: {
      normal: tw.amber[800], // amber-800
      muted: tw.amber[700], // amber-700
    },
    danger: {
      normal: tw.red[800], // red-800
      muted: tw.red[700], // red-700
    },
    info: {
      normal: tw.blue[800], // blue-800
      muted: tw.blue[700], // blue-700
    },
  },

  icon: {
    primary: {
      normal: tw.zinc[600], // zinc-600
      muted: tw.zinc[400], // zinc-400
      active: tw.zinc[800], // zinc-800
    },
    positive: {
      normal: tw.emerald[600], // emerald-600
      muted: tw.emerald[400], // emerald-400
      active: tw.emerald[800], // emerald-800
    },
    warning: {
      normal: tw.amber[600], // amber-600
      muted: tw.amber[400], // amber-400
      active: tw.amber[800], // amber-800
    },
    danger: {
      normal: tw.red[600], // red-600
      muted: tw.red[400], // red-400
      active: tw.red[800], // red-800
    },
    info: {
      normal: tw.blue[600], // blue-600
      muted: tw.blue[400], // blue-400
      active: tw.blue[800], // blue-800
    },
  },

  interactive: {
    primary: {
      normal: tw.sky[600], // sky-600
      active: tw.sky[800], // sky-800
      text: tw.white, // white
      border: {
        normal: tw.sky[600],
        active: 'transparent',
      },
    },
    secondary: {
      normal: tw.slate[900], // slate-900
      active: tw.slate[700], // slate-700
      text: tw.white, // white
      border: {
        normal: 'transparent',
        active: 'transparent',
      },
    },
    tertiary: {
      normal: tw.white, // white
      active: tw.zinc[100], //  zinc-100
      text: tw.zinc[800], // zinc-800
      border: {
        normal: tw.zinc[300],
        active: tw.zinc[400],
      },
    },
    positive: {
      normal: tw.emerald[600], // emerald-600
      active: tw.emerald[800], // emerald-800
      text: tw.white, // white
      border: {
        normal: 'transparent',
        active: 'transparent',
      },
    },
    warning: {
      normal: tw.amber[600], // amber-600
      active: tw.amber[800], // amber-800
      text: tw.white, // white
      border: {
        normal: 'transparent',
        active: 'transparent',
      },
    },
    danger: {
      normal: tw.red[600], // red-600
      active: tw.red[800], // red-800
      text: tw.white, // white
      border: {
        normal: 'transparent',
        active: 'transparent',
      },
    },
  },
} as const;

const darkColors: typeof lightColors = {
  ...lightColors,
} as const;

const shadows = {
  'base': {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1.5,
  },
  'md': {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  'lg': {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 7.5,
  },
  'xl': {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 25,
    elevation: 12.5,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 25 },
    shadowRadius: 50,
    elevation: 25,
  },
  'inner': {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  'none': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

const utils = {
  truncated: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
} as const;

const theme = {
  spacing,
  fontSizes,
  fonts,
  fontWeights,
  letterSpacings,
  lineHeights,
  radii,
  zIndices,
  borderWeights,
  shadows,
  utils,
} as const;

export const themeLight = {
  ...theme,
  colors: lightColors,
} as const;

export const themeDark = {
  ...theme,
  colors: darkColors,
};

export type Theme = typeof themeLight | typeof themeDark;

const ThemeContext = createContext<typeof themeLight | typeof themeDark>(themeLight);

interface ThemeProviderProps {
  children: React.ReactNode;
  value: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ value, children }) => {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (mode?: 'dark' | 'light') => {
  const theme = useContext(ThemeContext);

  if (mode === 'dark') {
    return themeDark;
  }

  if (mode === 'light') {
    return themeLight;
  }

  if (theme) {
    return theme;
  }

  throw new Error(
    '[theme] useTheme hook used in a component that is not a child of the ThemeProvider. Please fix this',
  );
};

import { makeTheme } from 'dripsy';
import colors from 'tailwindcss/colors';

const theme = makeTheme({
  space: {
    'xs': 4,
    'sm': 8,
    'md': 16,
    'lg': 24,
    'xl': 32,
    '-xs': -4,
    '-sm': -8,
    '-md': -16,
    '-lg': -24,
    '-xl': -32,
  },
  customFonts: {
    Inter: {
      100: 'InterThin',
      200: 'InterExtraLight',
      300: 'InterLight',
      400: 'Inter',
      normal: 'Inter',
      default: 'Inter',
      500: 'InterMedium',
      600: 'InterSemiBold',
      700: 'InterBold',
      800: 'InterExtraBold',
      900: 'InterBlack',
    },
  },
  fontSizes: {
    'xs': 12,
    'sm': 14,
    'md': 16,
    'lg': 18,
    'xl': 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fonts: {
    root: 'Inter',
  },
  fontWeights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  lineHeights: {
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
  },
  radii: {
    'none': 0,
    'sm': 2,
    'base': 4,
    'md': 6,
    'lg': 8,
    'xl': 12,
    '2xl': 16,
    '3xl': 24,
    'full': 999,
  },
  zIndices: {
    modal: 30,
    popover: 40,
    overlay: 50,
    max: 999,
  },
  borderWeights: {
    light: '1px',
    normal: '2px',
    bold: '3px',
    extrabold: '4px',
    black: '5px',
  },
  colors: {
    'white': colors.white,
    'black': colors.black,
    'transparent': 'transparent',

    // All tailwind colors
    'background-primary': colors.white, // white
    'background-secondary': colors.zinc[50], // zinc-50
    'background-tertiary': colors.zinc[100], // zinc-100
    'background-positive': colors.emerald[50], // emerald-50
    'background-warning': colors.amber[50], // amber-50
    'background-danger': colors.red[50], // red-50
    'background-info': colors.blue[50], // blue-50

    'divider': colors.zinc[300], // zinc-300
    'border-primary': colors.zinc[300], // zinc-300
    'border-primary-active': colors.sky[600], // sky-600
    'border-danger': colors.red[600], // red-600
    'border-danger-active': colors.red[800], // red-800

    'placeholder-normal': colors.slate[400], // slate-400,
    'placeholder-danger': colors.red[300], // red-300

    'text-normal': colors.zinc[900], // zinc-900
    'text-muted': colors.zinc[500], // zinc-500
    'text-positive-normal': colors.emerald[800], // emerald-800
    'text-positive-muted': colors.emerald[700], // emerald-700
    'text-warning-normal': colors.amber[800], // amber-800
    'text-warning-muted': colors.amber[700], // amber-700
    'text-danger-normal': colors.red[800], // red-800
    'text-danger-muted': colors.red[700], // red-700
    'text-info-normal': colors.blue[800], // blue-800
    'text-info-muted': colors.blue[700], // blue-700

    'interactive-primary-normal': colors.sky[600], // sky-600
    'interactive-primary-hover': colors.sky[700], // sky-700
    'interactive-primary-active': colors.sky[800], // sky-800
    'interactive-primary-text': colors.white, // white
    'interactive-primary-border': 'transparent',
    'interactive-primary-border-hover': 'transparent',

    'interactive-secondary-normal': colors.slate[900], // slate-900
    'interactive-secondary-hover': colors.slate[800], // slate-800
    'interactive-secondary-active': colors.slate[700], // slate-700
    'interactive-secondary-text': colors.white, // white
    'interactive-secondary-border': 'transparent',
    'interactive-secondary-border-hover': 'transparent',

    'interactive-tertiary-normal': colors.white, // white
    'interactive-tertiary-hover': colors.zinc[50], //  zinc-50
    'interactive-tertiary-active': colors.zinc[100], //  zinc-100
    'interactive-tertiary-text': colors.zinc[800], // zinc-800
    'interactive-tertiary-border': colors.zinc[300], // zinc-300
    'interactive-tertiary-border-hover': colors.zinc[400], // zinc-400

    'interactive-success-normal': colors.emerald[600], // emerald-600
    'interactive-success-hover': colors.emerald[700], // emerald-700
    'interactive-success-active': colors.emerald[800], // emerald-800
    'interactive-success-text': colors.white, // white
    'interactive-success-border': 'transparent',
    'interactive-success-border-hover': 'transparent',

    'interactive-warning-normal': colors.amber[600], // amber-600
    'interactive-warning-hover': colors.amber[700], // amber-700
    'interactive-warning-active': colors.amber[800], // amber-800
    'interactive-warning-text': colors.white, // white
    'interactive-warning-border': 'transparent',
    'interactive-warning-border-hover': 'transparent',

    'interactive-danger-normal': colors.red[600], // red-600
    'interactive-danger-hover': colors.red[700], // red-700
    'interactive-danger-active': colors.red[800], // red-800
    'interactive-danger-text': colors.white, // white
    'interactive-danger-border': 'transparent',
    'interactive-danger-border-hover': 'transparent',

    'icon-normal': colors.zinc[600], // zinc-600
    'icon-muted': colors.zinc[400], // zinc-400
    'icon-hover': colors.zinc[700], // zinc-700
    'icon-active': colors.zinc[800], // zinc-800
    'icon-positive': colors.emerald[600], // emerald-600
    'icon-positive-light': colors.emerald[400], // emerald-400
    'icon-warning': colors.amber[600], // amber-600
    'icon-warning-light': colors.amber[400], // amber-400
    'icon-danger': colors.red[600], // red-600
    'icon-danger-light': colors.red[400], // red-400
    'icon-info': colors.blue[600], // blue-600
    'icon-info-light': colors.blue[400], // blue-400
  },
  shadows: {
    'base': {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
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
      shadowOpacity: 1,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 0,
      elevation: 0,
    },
  },

  text: {
    'xs': {
      fontSize: 'xs',
      lineHeight: 'xs',
      paddingTop: 3,
    },
    'sm': {
      fontSize: 'sm',
      lineHeight: 'sm',
    },
    'md': {
      fontSize: 'md',
      lineHeight: 'md',
    },
    'base': {
      fontSize: 'md',
      lineHeight: 'md',
    },
    'body': {
      fontSize: 'md',
      lineHeight: 'md',
    },
    'lg': {
      fontSize: 'lg',
      lineHeight: 'lg',
    },
    'xl': {
      fontSize: 'xl',
      lineHeight: 'xl',
    },
    '2xl': {
      fontSize: '2xl',
      lineHeight: '2xl',
    },
    '3xl': {
      fontSize: '3xl',
      lineHeight: '3xl',
    },
    '4xl': {
      fontSize: '4xl',
      lineHeight: '4xl',
    },
    'truncated': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    'normal': {
      color: 'text-normal',
    },
    'muted': {
      color: 'text-muted',
    },
    'positive-normal': {
      color: 'text-positive-normal',
    },
    'positive-muted': {
      color: 'text-positive-muted',
    },
    'warning-normal': {
      color: 'text-warning-normal',
    },
    'warning-muted': {
      color: 'text-warning-muted',
    },
    'danger-normal': {
      color: 'text-danger-normal',
    },
    'danger-muted': {
      color: 'text-danger-muted',
    },
    'info-normal': {
      color: 'text-info-normal',
    },
    'info-muted': {
      color: 'text-info-muted',
    },
  },
  types: {
    onlyAllowThemeValues: {
      color: 'always',
      colors: 'always',
    },
  },
});

type MyTheme = typeof theme;

declare module 'dripsy' {
  interface DripsyCustomTheme extends MyTheme {}
}

const darkTheme: typeof theme = {
  ...theme,
};

export { theme, darkTheme };

const tw = require('tailwindcss/colors');

const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
} as const;

const colors = {
  white: tw.white,
  black: tw.black,
  transparent: tw.transparent,
};

const backgroundColor = {
  primary: tw.zinc[50], // zinc-50
  secondary: tw.white, // white
  tertiary: tw.zinc[100], // zinc-100
  positive: tw.emerald[50], // emerald-50
  warning: tw.amber[50], // amber-50
  danger: tw.red[50], // red-50
  info: tw.blue[50], // blue-50
  overlay: 'rgba(113, 113, 122, 0.75)', // zinc-500 0.75 opacity

  interactive: {
    primary: {
      normal: tw.sky[600], // sky-600
      active: tw.sky[800], // sky-800
    },
    secondary: {
      normal: tw.slate[900], // slate-900
      active: tw.slate[700], // slate-700
    },
    tertiary: {
      normal: tw.white, // white
      active: tw.zinc[100], //  zinc-100
    },
    positive: {
      normal: tw.emerald[600], // emerald-600
      active: tw.emerald[800], // emerald-800
    },
    warning: {
      normal: tw.amber[600], // amber-600
      active: tw.amber[800], // amber-800
    },
    danger: {
      normal: tw.red[600], // red-600
      active: tw.red[800], // red-800
    },
  },
};

const borderColor = {
  divider: tw.zinc[300], // zinc-300
  primary: {
    normal: tw.zinc[300], // zinc-300
    active: tw.sky[600], // sky-600
  },
  danger: {
    normal: tw.red[600], // red-600
    active: tw.red[800], // red-800
  },

  interactive: {
    primary: {
      normal: tw.sky[600],
      active: 'transparent',
    },
    secondary: {
      normal: 'transparent',
      active: 'transparent',
    },
    tertiary: {
      normal: tw.zinc[300],
      active: tw.zinc[400],
    },
    positive: {
      normal: 'transparent',
      active: 'transparent',
    },
    warning: {
      normal: 'transparent',
      active: 'transparent',
    },
    danger: {
      normal: 'transparent',
      active: 'transparent',
    },
  },
};

const placeholderColor = {
  normal: tw.slate[400], // slate-400,
  danger: tw.red[300], // red-300
};

const textColor = {
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
    primary: tw.white,
    secondary: tw.white,
    tertiary: tw.zinc[800],
    positive: tw.white,
    warning: tw.white,
    danger: tw.white,
  },
};

export default {
  spacing,
  colors,
  backgroundColor,
  borderColor,
  placeholderColor,
  textColor,
};

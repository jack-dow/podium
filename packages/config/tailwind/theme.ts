import colors from "./colors";

const theme = {
  spacing: {
    none: "0px",
    px: "1px",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    base: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  backgroundColor: {
    white: colors.white,
    black: colors.black,
    transparent: colors.transparent,

    primary: colors.zinc[50],
    secondary: colors.white,
    tertiary: colors.zinc[100],
    positive: colors.emerald[50],
    warning: colors.amber[50],
    danger: colors.red[50],
    info: colors.blue[50],
    overlay: "rgba(113, 113, 122, 0.75)",

    interactive: {
      primary: {
        normal: colors.sky[600],
        active: colors.sky[800],
      },
      secondary: {
        normal: colors.slate[900],
        active: colors.slate[700],
      },
      tertiary: {
        normal: colors.white,
        active: colors.zinc[100],
      },
      positive: {
        normal: colors.emerald[600],
        active: colors.emerald[800],
      },
      warning: {
        normal: colors.amber[600],
        active: colors.amber[800],
      },
      danger: {
        normal: colors.red[600],
        active: colors.red[800],
      },
    },
  },
  borderColor: {
    white: colors.white,
    black: colors.black,
    transparent: colors.transparent,

    divider: colors.zinc[300],

    primary: {
      normal: colors.zinc[300],
      active: colors.sky[600],
    },
    danger: {
      normal: colors.red[600],
      active: colors.red[800],
    },

    interactive: {
      primary: {
        normal: colors.sky[600],
        active: colors.sky[800],
      },
      secondary: {
        normal: "transparent",
        active: "transparent",
      },
      tertiary: {
        normal: colors.zinc[300],
        active: colors.zinc[400],
      },
      positive: {
        normal: "transparent",
        active: "transparent",
      },
      warning: {
        normal: "transparent",
        active: "transparent",
      },
      danger: {
        normal: "transparent",
        active: "transparent",
      },
    },
  },
  placeholderColor: {
    normal: colors.slate[400],
    danger: colors.red[300],
  },
  textColor: {
    white: colors.white,
    black: colors.black,

    label: colors.zinc[800],
    primary: {
      normal: colors.zinc[900],
      muted: colors.zinc[500],
    },
    positive: {
      normal: colors.emerald[600],
      muted: colors.emerald[700],
      dark: colors.emerald[800],
    },
    warning: {
      normal: colors.amber[600],
      muted: colors.amber[700],
      dark: colors.amber[800],
    },
    danger: {
      normal: colors.red[600],
      muted: colors.red[700],
      dark: colors.red[800],
    },
    info: {
      normal: colors.blue[600],
      muted: colors.blue[700],
      dark: colors.blue[800],
    },

    icon: {
      primary: {
        normal: colors.zinc[600],
        muted: colors.zinc[400],
        active: colors.zinc[800],
      },
      positive: {
        normal: colors.emerald[600],
        muted: colors.emerald[400],
        active: colors.emerald[800],
      },
      warning: {
        normal: colors.amber[600],
        muted: colors.amber[400],
        active: colors.amber[800],
      },
      danger: {
        normal: colors.red[600],
        muted: colors.red[400],
        active: colors.red[800],
      },
      info: {
        normal: colors.blue[600],
        muted: colors.blue[400],
        active: colors.blue[800],
      },
    },

    button: {
      primary: colors.white,
      secondary: colors.white,
      tertiary: colors.zinc[800],
      positive: colors.white,
      warning: colors.white,
      danger: colors.white,
    },

    interactive: {
      primary: {
        normal: colors.sky[600],
        active: colors.sky[800],
      },
      secondary: {
        normal: colors.slate[900],
        active: colors.slate[700],
      },
      tertiary: {
        normal: colors.white,
        active: colors.zinc[100],
      },
      positive: {
        normal: colors.emerald[600],
        active: colors.emerald[800],
      },
      warning: {
        normal: colors.amber[600],
        active: colors.amber[800],
      },
      danger: {
        normal: colors.red[600],
        active: colors.red[800],
      },
    },

    set: {
      warmup: colors.amber[700],
      working: colors.slate[700],
      backoff: colors.violet[700],
      dropset: colors.emerald[700],
      failure: colors.red[700],
      cooldown: colors.sky[700],
    },
  },
} as const;

export default theme;

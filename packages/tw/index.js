const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './src/_app.tsx'],
  darkMode: ['class'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#fff',
      black: '#000',
      gray: colors.zinc,
      slate: colors.slate,
      sky: colors.sky,
      red: colors.red,
      yellow: colors.amber,
      orange: colors.amber,
      green: colors.emerald,
    },
    extend: {
      fontFamily: {
        sans: 'Inter var,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

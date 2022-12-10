const nativewind = require('nativewind/tailwind');

/** @type {import("tailwindcss").Config} */
module.exports = {
  // Context MUST also be set here for nativewind to work properly.
  content: ['./src/**/*.{ts,tsx}', './src/_app.tsx', './src/index.ts'],
  presets: [nativewind, require('@podium/tailwindcss')],
};

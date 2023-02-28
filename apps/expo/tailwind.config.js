const nativewind = require("nativewind/tailwind");

/** @type {import("tailwindcss").Config} */
module.exports = {
  // Content MUST also be set here for nativewind to work properly.
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [nativewind, require("@podium/tailwind-config")],
};

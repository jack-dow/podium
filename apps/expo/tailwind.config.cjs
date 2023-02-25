/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@podium/tailwind-config")],
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
};

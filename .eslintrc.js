/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["podium"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
  settings: {
    next: {
      rootDir: ["apps/nextjs"],
    },
    tailwindcss: {
      config: "./packages/config/tailwind/index.js",
    },
  },
};

module.exports = config;

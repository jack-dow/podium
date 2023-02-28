import typescript from "@rollup/plugin-typescript";

const config = {
  input: "./theme.ts",
  output: {
    dir: "./",
    format: "cjs",
  },
  plugins: [typescript()],
};

export default config;

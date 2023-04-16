module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      require.resolve("expo-router/babel"),
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          alias: {
            "~": "./src",
          },
        },
      ],
      ["@babel/plugin-proposal-private-methods", { loose: true }],
    ],
    presets: ["babel-preset-expo", "nativewind/babel"],
  };
};

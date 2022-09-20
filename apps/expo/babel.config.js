module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
          },
        },
      ],
    ],
    presets: ['babel-preset-expo'],
  };
};

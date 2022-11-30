module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@ui': './src/components/ui',
          },
        },
      ],
    ],
    presets: ['babel-preset-expo', 'nativewind/babel'],
  };
};

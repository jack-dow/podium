// module.exports = {
//   resolver: {
//     /* resolver options */
//     sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'svg'],
//   },
// };

const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const {
    resolver: { assetExts },
  } = getDefaultConfig(__dirname);

  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'svg'],
    },
  };
})();

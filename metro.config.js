const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const {
    resolver: { assetExts },
  } = getDefaultConfig(__dirname);

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      assetExts: [...assetExts, "bin"], // Add bin to asset extensions
    },
  };
})();

// module.exports = (async () => {
//   const defaultconfig = getDefaultConfig(__dirname);
//   const assetexts = defaultconfig.resolver.assetExts;
//   return {
//     resolver: {
//       // add bin to assetexts
//       assetexts: [...assetexts, "bin"],
//     },
//   };
// })();

// module.exports = (async () => {
//   const defaultConfig = await getDefaultConfig(__dirname);

//   return {
//     ...defaultConfig,
//     transformer: {
//       ...defaultConfig.transformer,
//       babelTransformerPath: require.resolve("./assets/kaggle"),
//     },
//   };
// })();

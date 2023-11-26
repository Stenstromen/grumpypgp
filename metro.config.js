const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// Fetch the default configuration
const defaultConfig = getDefaultConfig(__dirname);

// Extend the default assetExts array to include 'js'
const assetExts = [...defaultConfig.resolver.assetExts, 'js'];

// Custom configuration
const config = {
  resolver: {
    assetExts,
  },
};

module.exports = mergeConfig(defaultConfig, config);

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

// Get base config
const baseConfig = getDefaultConfig(__dirname);

// Customize asset extensions
const customConfig = {
  resolver: {
    assetExts: [
      'png', 'jpg', 'jpeg', 'svg', 'gif',
      'webp', 'ttf', 'otf',
    ],
  },
};

// Merge base config with custom changes
const mergedConfig = mergeConfig(baseConfig, customConfig);

// Wrap with NativeWind and Reanimated support
const finalConfig = wrapWithReanimatedMetroConfig(
  withNativeWind(mergedConfig, { input: './global.css' })
);

module.exports = finalConfig;

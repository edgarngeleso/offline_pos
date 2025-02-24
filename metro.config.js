const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

/**Code to compile ui kitten components during build time**/

//const {getDefaultConfig} = require('metro-config');
const MetroConfig = require('@ui-kitten/metro-config');
const evaConfig = {
  evaPackage: '@eva-design/eva',
};
module.exports = async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  return MetroConfig.create(evaConfig, defaultConfig);
};

/********** END *************/
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

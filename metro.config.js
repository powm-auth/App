const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const sdkPath = path.resolve(projectRoot, '../sdk-js');

const config = getDefaultConfig(projectRoot);

// Watch the SDK folder so changes are picked up and files can be resolved
config.watchFolders = [sdkPath];

// Ensure node_modules are resolved correctly
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
];

module.exports = config;

// Polyfills must be imported before anything else
// Using 'require' instead of import because of vscode/eslint reordering issues
require('./src/polyfills');
require('expo-router/entry');


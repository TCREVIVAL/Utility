const webpack = require('webpack');

module.exports = function override(config) {
  // Add .mjs to the list of extensions Webpack should resolve
  config.resolve.extensions = ['.js', '.json', '.mjs'];

  // Provide fallbacks for Node.js core modules that might be required in the browser
  config.resolve.fallback = {
    process: require.resolve('process/browser'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    url: require.resolve('url/'),
    crypto: require.resolve('crypto-browserify'),
  };

  // Add process and Buffer polyfills using webpack.ProvidePlugin
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};

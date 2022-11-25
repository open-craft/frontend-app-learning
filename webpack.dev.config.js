const { ModuleFederationPlugin } = require('webpack').container;
const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('webpack-dev', {
  plugins: [
    new ModuleFederationPlugin({
      name: 'learning',
      filename: 'remote.js',
      shared: {
        react: {
          singleton: true,
          requiredVersion: '16.14.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '16.14.0',
        },
      },
    }),
  ],
});

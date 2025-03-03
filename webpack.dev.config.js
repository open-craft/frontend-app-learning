const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('webpack-dev');

function* getPackages(scope, dir) {
  for (const pkg of fs.readdirSync(dir)) {
    if (!scope && pkg.startsWith('@')) {
      yield* getPackages(pkg, path.join(dir, pkg));
    } else if (pkg.startsWith('frontend-slot')) {
      const packageJsonPath = path.join(dir, pkg, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        yield {
          scope,
          name: pkg,
        };
      }
    }
  }
}

function getPlugins() {
  console.log(process.cwd());
  return Array.from(
    getPackages(null, path.resolve(process.cwd(), 'node_modules')),
  );
}

const plugins = getPlugins();

console.log({ plugins });

// Define plugin imports to include them eagerly
const pluginAliases = plugins.reduce((aliases, plugin) => {
  const aliasKey = `${plugin.scope ? plugin.scope + '/' : ''}${plugin.name}`;
  aliases[aliasKey] = path.resolve(
    path.join(process.cwd(), 'node_modules', aliasKey)
  );
  return aliases;
}, {});

config.resolve.alias = {
  ...config.resolve.alias,
  ...pluginAliases,
  '@src': path.resolve(__dirname, 'src'),
};

config.plugins = [
  ...config.plugins,
  new webpack.DefinePlugin({
    PLUGINS: JSON.stringify(plugins),
  }),
];

config.cache = { type: 'filesystem' };

config.ignoreWarnings = [];

console.log(config.resolve);
module.exports = config;

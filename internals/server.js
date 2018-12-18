const path = require('path');
const express = require('express');
const chalk = require('chalk');
const compression = require('compression');

const {
  PORT,
  APP_PATH,
  BUILD_PATH,
  PUBLIC_PATH,
} = require('./constants');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Starts an express server.
 */

module.exports = () => {
  const server = express();

  return {
    start: () => {
      if (isProduction) {
        server.use(compression());
      }

      // Set headers
      server.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        next();
      });

      // Add middleware
      if (!isProduction) {
        addDevMiddleware(server);
      }

      // Serve build
      server.use(PUBLIC_PATH, express.static(path.join(APP_PATH, BUILD_PATH)));

      // Serve document
      server.get('*', async (req, res) => {
        if (!isProduction) {
          return res.send(require('./document')()); // eslint-disable-line global-require
        }
        return null;
      });

      // Start
      server.listen(PORT, () => {
        /* eslint-disable no-console */
        console.log();
        console.log(chalk.blue(` NODE_ENV = ${process.env.NODE_ENV}`));
        console.log(chalk.blue(` BUILD_PATH = ${BUILD_PATH}`));
        console.log(chalk.blue(` PUBLIC_PATH = ${PUBLIC_PATH}`));
        /* eslint-enable no-console */
      });
    },
  };
};

const addDevMiddleware = (server) => {
  /* eslint-disable global-require */
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config.js');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  /* eslint-enable global-require */

  const compiler = webpack(webpackConfig);

  server.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    stats: {
      colors: true,
    },
  }));
  server.use(webpackHotMiddleware(compiler));
};

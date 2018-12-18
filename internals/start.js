const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const { APP_PATH, BUILD_PATH } = require('./constants');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Starts server once the bundle is ready.
 */

const start = (server) => {
  console.log(chalk.yellow(' Starting server...')); // eslint-disable-line no-console
  server().start();
};

try {
  const server = require('./server'); // eslint-disable-line global-require

  if (isProduction && fs.existsSync(path.join(APP_PATH, BUILD_PATH))) {
    start(server);
  } else {
    // eslint-disable-next-line global-require, promise/catch-or-return
    require('./build').then(() => start(server));
  }
} catch (err) {
  console.error(chalk.red(err.stack)); // eslint-disable-line no-console
  console.error(chalk.redBright('\nCould not start server.')); // eslint-disable-line no-console
  process.exit(1);
}

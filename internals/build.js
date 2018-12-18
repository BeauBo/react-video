const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const readline = require('readline');
const chalk = require('chalk');
const path = require('path');

const nextFrame = (() => {
  let i = 0;
  const frames = [
    '.  ', ' . ', '  .', '.: ', ' .:',
    ': .', '. :', ':. ', ' :.', ': :',
    '...', '...', '..:', '.:.', '.: ',
    ':..', '.::', ':.:', '::.', ':::',
  ];
  return () => {
    const frame = frames[i];
    i = (i + 1) % frames.length;
    return frame;
  };
})();

/**
 * Bundles the app based on webpack config.
 */
const bundle = (resolve) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const webpackConfig = require(path.join(process.cwd(), './internals/webpack.config.js'));
  const compiler = webpack(webpackConfig);
  let isBuildingModules = false;

  console.time(chalk.green('Compile time')); // eslint-disable-line no-console
  console.log(chalk.blue('Building client...\n')); // eslint-disable-line no-console

  compiler.apply(
    new ProgressPlugin((percentage, msg) => {
      if (msg.match(/building modules/)) {
        if (!isBuildingModules) {
          isBuildingModules = true;
          process.stdout.write(`[webpack] ${msg}`);
        }

        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`[${Math.round(percentage * 1.4 * 100)}] Building webpack modules... ${nextFrame()}`);
      } else if (msg) {
        if (isBuildingModules) {
          process.stdout.write('\n');
          isBuildingModules = false;
        }
        process.stdout.write(`[webpack] ${msg}\n`);
      }
    }),
  );

  compiler.run((err, rawStats) => {
    if (err) {
      throw err;
    } else {
      const stats = rawStats.toJson();
      if (stats.errors.length) {
        throw stats.errors[0];
      } else {
        console.timeEnd(chalk.green('Compile time')); // eslint-disable-line no-console
        resolve();
      }
    }
  });
};

module.exports = new Promise((resolve) => {
  try {
    bundle(resolve);
  } catch (err) {
    console.error(chalk.redBright(err)); // eslint-disable-line no-console
  }
});

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const config = require('./webpack.config.js');

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  noInfo: true,
  stats: {
    colors: true,
  },
}));

app.use(webpackHotMiddleware(compiler));

app.listen(3000, () => console.log('Example app listening on port 3000!\n')); // eslint-disable-line no-console

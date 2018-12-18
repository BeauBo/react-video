const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');
const {
  APP_PATH,
  BUILD_PATH,
  PUBLIC_PATH,
} = require('./constants');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: (function () { // eslint-disable-line func-names
    const entry = {
      app: [
        path.join(APP_PATH, 'src/index.js'),
      ],
    };

    if (isProduction) {
      entry.app.unshift(require.resolve(path.join(APP_PATH, 'src/configs/polyfills')));
    } else {
      entry.app.unshift('webpack-hot-middleware/client?reload=true');
    }

    return entry;
  }()),
  // entry: {
  //   app: ['webpack-hot-middleware/client?reload=true', path.join(APP_PATH, 'src/index.js')],
  // },
  output: {
    path: path.join(APP_PATH, BUILD_PATH),
    publicPath: PUBLIC_PATH,
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    sourceMapFilename: isProduction ? '[name].[chunkhash].map' : '[name].map',
  },
  devtool: isProduction ? 'cheap-module-source-map' : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'url-loader?limit=12000',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'url-loader?limit=25000',
      },
      {
        test: /\.(csv|tsv)$/,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      src: path.join(APP_PATH, 'src'),
      app: path.join(APP_PATH, 'src', 'app'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new ManifestPlugin({ fileName: 'webpack-manifest.json' }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

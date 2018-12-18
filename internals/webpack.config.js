const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
  output: {
    path: path.join(APP_PATH, BUILD_PATH),
    publicPath: PUBLIC_PATH,
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    sourceMapFilename: isProduction ? '[name].[chunkhash].map' : '[name].map',
  },
  devtool: isProduction ? 'cheap-module-source-map' : 'inline-source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    noEmitOnErrors: true,
    concatenateModules: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
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

  plugins: (function () { // eslint-disable-line func-names
    const plugins = [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new CleanWebpackPlugin(['.build'], { root: APP_PATH }),
    ];

    if (isProduction) {
      plugins.push(
        new MiniCssExtractPlugin({
          filename: '[name].[hash].css',
          chunkFilename: '[id].[hash].css',
        }),
        new ManifestPlugin({ filename: 'webpack-manifest.json' }),
      );
    } else {
      plugins.push(
        new webpack.HotModuleReplacementPlugin(),
      );
    }

    return plugins;
  }()),
};

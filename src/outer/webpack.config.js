const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve( __dirname, './' );
const DESTINATION = path.resolve( __dirname, '../../dist/outer' );

module.exports = {
  context: ROOT,

  entry: {
    'refunds.proxy': './refunds.proxy.ts'
  },

  output: {
    filename: '[name].js',
    path: DESTINATION,
    libraryTarget: 'umd',
    library: 'gp2'
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      ROOT,
      '../node_modules'
    ]
  },

  externals: {
    jquery: 'jquery'
  },

  module: {
    rules: [
      /****************
       * PRE-LOADERS
       *****************/
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'source-map-loader'
      },
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'tslint-loader'
      },

      /****************
       * LOADERS
       *****************/
      {
        test: /\.ts$/,
        exclude: [ /node_modules/ ],
        loader: 'awesome-typescript-loader',
        query: {
          configFileName: 'tsconfig.outer.json'
        }
      }
    ]
  },

  devtool: 'cheap-module-source-map',
  devServer: {}
};

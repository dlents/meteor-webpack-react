var baseConfig = require('./webpack.config.client');
var _ = require('lodash');
// var path = require('path');
var webpack = require('webpack');
var devProps = require('./devProps');
// DKL
// var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  env: 'dev',
  debug: true,
  devtool: 'eval',
  hotComponents: true,
  entry: [
    'webpack-dev-server/client?' + devProps.baseUrl,
    'webpack/hot/only-dev-server'
  ].concat(baseConfig.entry),
  output: _.assign(_.clone(baseConfig.output), {
    publicPath: devProps.baseUrl + '/assets/',
    pathinfo: true,
    // crossOriginLoading is important since we are running
    // webpack-dev-server from a different port than Meteor
    crossOriginLoading: 'anonymous'
  }),

  //module: {
  //   loaders: [
  //      {
  //         test: /\.jsx?$/,
  //         loader: 'babel',
  //         exclude: /node_modules|lib/,
  //         query: {
  //            stage: 0,
  //            cacheDirectory: true,
  //            plugins: [
  //               'react-transform'
  //            ],
  //            extra: {
  //               'react-transform': {
  //                  transforms: [
  //                     {
  //                        transform: 'react-transform-hmr',
  //                        imports: ['react'],
  //                        // this is important for Webpack HMR:
  //                        locals: ['module']
  //                     },
  //                     {
  //                        transform: 'react-transform-catch-errors',
  //                        // the second import is the React component to render error
  //                        // (it can be a local path too, like './src/ErrorReporter')
  //                        imports: [
  //                           'react',
  //                           'redbox-react'
  //                        ]
  //                     }
  //                  ]
  //               }
  //            },
  //         },
  //      },
  //   ],
  //},

  plugins: (baseConfig.plugins || []).concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)

    // new ExtractTextPlugin("[name].css")
  ]),
  devServer: {
    publicPath: devProps.baseUrl + '/assets/',
    host: devProps.host,
    hot: true,
    historyApiFallback: true,
    contentBase: devProps.contentBase,
    port: devProps.webpackPort,
    stats: {
      colors: true,
      chunkModules: false,
      modules: false
    }
  }
};

module.exports = _.assign(baseConfig, config);
var JSON5 = require('json5');
console.log('client: ' + JSON5.stringify(module.exports, null, 3));

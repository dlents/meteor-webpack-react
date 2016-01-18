var webpack = require('webpack');
var config = require('./webpack.config.server');
var _ = require('lodash');

module.exports = _.assign(_.clone(config), {
  minimize: true,
  plugins: (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true)
  ])
});
var JSON5 = require('json5');
console.log('client: ' + JSON5.stringify(module.exports, null, 3));

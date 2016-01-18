//var webpack = require('webpack');
var baseConfig = require('./webpack.config.server');
var _ = require('lodash');

var config = {
  devtool: 'source-map',
  prerender: false,
  output: _.assign(_.clone(baseConfig.output), {
    pathinfo: true
  })
};

module.exports = _.assign(_.clone(baseConfig), config);

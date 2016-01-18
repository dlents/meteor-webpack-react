var path = require('path');
var webpack = require('webpack');
var context = __dirname;
module.exports = {
  context: context,
  target: 'node',
  loadStyles: false,
  prerender: false,
  entry: [
    path.join(context, './lib/core-js-no-number'),
    'regenerator/runtime',
    path.join(context, '../app/main_server')
  ],
  output: {
    path: path.join(__dirname, 'assets'),
    filename: 'server.bundle.js',
    publicPath: '/assets/'
  }
};

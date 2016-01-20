var path = require('path');
// var webpack = require('webpack');
var context = __dirname;
module.exports = {
  loadStyles: true,
  context: __dirname,
  entry: [
    path.join(context, 'lib/core-js-no-number'),
    'regenerator/runtime',
    path.join(context, '../app/main_client')
  ],
  output: {
    path: path.join(__dirname, 'assets'),
    filename: 'client.bundle.js',
    publicPath: '/assets/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.join(__dirname, '../app')
  }
};

// When inside Redux repo, prefer src to compiled version.
// You can safely delete these lines in your project.
//var reduxSrc = path.join(__dirname, '..', '..', 'src')
//var reduxNodeModules = path.join(__dirname, '..', '..', 'node_modules')
//var fs = require('fs')
//if (fs.existsSync(reduxSrc) && fs.existsSync(reduxNodeModules)) {
//   // Resolve Redux to source
//   module.exports.resolve = { alias: { 'redux': reduxSrc } }
//   // Compile Redux from source
//   module.exports.module.loaders.push({
//      test: /\.js$/,
//      loaders: [ 'babel' ],
//      include: reduxSrc
//   })
//}

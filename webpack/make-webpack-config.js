var path = require("path");
var _ = require('lodash');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var StatsPlugin = require("stats-webpack-plugin");
var loadersByExtension = require("./config/loadersByExtension");

module.exports = function (options) {
  //var entry = {
  //	main: options.prerender ? "./config/mainPrerenderer" : "./config/mainApp"
  //	// second: options.prerender ? "./config/secondPrerenderer" : "./config/secondApp"
  //};
  var rootPath = path.join(__dirname, "../app");

  // var jsLoader = 'jsx-loader?harmony!babel?presets[]=react,presets[]=es2015,presets[]=stage-2';
  var jsLoader = 'babel';
  var loaders = {
    "js|jsx": {
      loader: (options.hotComponents ? "react-hot!" : "") + jsLoader,
      include: [
        rootPath,
        __dirname
      ],
      exclude: [
        /node_modules/,
        path.join(__dirname, './lib')
      ]
    },
    //"js": {
    //  loader: "babel-loader?stage=0",
    //  include: path.join(__dirname, "../app")
    //  // exclude: /node_modules|lib/
    //},
    "json": "json-loader",
    "coffee": "coffee-redux-loader",
    "json5": "json5-loader",
    "txt": "raw-loader",
    "png|jpg|jpeg|gif|svg": "url-loader?limit=10000",
    "woff|woff2": "url-loader?limit=100000",
    "ttf|eot": "file-loader",
    "wav|mp3": "file-loader",
    "html": "html-loader",
    "md|markdown": [ "html-loader", "markdown-loader" ]
  };
  var cssLoader = options.minimize ? "css-loader?module" : "css-loader?module&localIdentName=[path][name]---[local]---[hash:base64:5]";
  // var cssLoader = 'css-loader';
  var stylesheetLoaders = {
      "css": cssLoader,
      "less": [ cssLoader, "less-loader" ],
      "styl": [ cssLoader, "stylus-loader" ],
      "scss|sass": [
        //'isomorphic-style-loader',
        cssLoader,
        'sass-loader',
        'postcss-loader'
      ]
  };

  Object.keys(stylesheetLoaders).forEach(function (ext) {
    var stylesheetLoader = stylesheetLoaders[ ext ];
    if (Array.isArray(stylesheetLoader)) stylesheetLoader = stylesheetLoader.join("!");
    if (options.prerender || !options.loadStyles && typeof stylesheetLoader === 'string') {
      stylesheetLoaders[ ext ] = stylesheetLoader.replace(/^css-loader/, "css-loader/locals");
    } else if (options.separateStylesheet) {
      stylesheetLoaders[ ext ] = ExtractTextPlugin.extract("style-loader", stylesheetLoader);
    } else {
      stylesheetLoaders[ext] = "style-loader!" + stylesheetLoader;
      // stylesheetLoaders[ ext ] = stylesheetLoader;
    }
  });

  var additionalLoaders = [
    // { test: /some-reg-exp$/, loader: "any-loader" }
  ];
  var alias = {};
  var aliasLoader = {};
  var externals = [];
  var modulesDirectories = [ "web_modules", "node_modules" ];
  var extensions = [ "", ".web.js", ".js", ".jsx" ];

  //var publicPath = options.devServer ?
  //	"http://localhost:2992/_assets/" :
  //	"/_assets/";
  //var output = {
  //	path: path.join(__dirname, "build", options.prerender ? "prerender" : "public"),
  //	publicPath: publicPath,
  //	filename: "[name].js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
  //	chunkFilename: (options.devServer ? "[id].js" : "[name].js") + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
  //	sourceMapFilename: "debugging/[file].map",
  //	libraryTarget: options.prerender ? "commonjs2" : undefined,
  //	pathinfo: options.debug || options.prerender
  //};

  var excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/,
    /node_modules[\\\/]items-store[\\\/]/
  ];
  var plugins = [
    new ExtractTextPlugin('app.css', {
      allChunks: true
    }),
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment")
  ];
  if (options.prerender) {
    plugins.push(new StatsPlugin(path.join("./build", "stats.prerender.json"), {
      chunkModules: true,
      exclude: excludeFromStats
    }));
    aliasLoader[ "react-proxy$" ] = "react-proxy/unavailable";
    aliasLoader[ "react-proxy-loader$" ] = "react-proxy-loader/unavailable";
    externals.push(
      /^react(\/.*)?$/,
      /^redux(\/.*)?$/,
      "superagent",
      "async"
    );
    plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
  } else {
    plugins.push(new StatsPlugin(path.join("./build", "stats.json"), {
      chunkModules: true,
      exclude: excludeFromStats
    }));
  }
  if (options.commonsChunk) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin("commons", "commons.js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : "")));
  }

  //var asyncLoader = {
  //	test: require("./app/route-handlers/async").map(function(name) {
  //		return path.join(__dirname, "app", "route-handlers", name);
  //	}),
  //	loader: options.prerender ? "react-proxy-loader/unavailable" : "react-proxy-loader"
  //};


  if (options.separateStylesheet && !options.prerender) {
    plugins.push(new ExtractTextPlugin("[name].css" + (options.longTermCaching ? "?[contenthash]" : "")));
  }
  if (options.minimize && !options.prerender) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
      new webpack.optimize.DedupePlugin()
    );
  }
  if (options.minimize) {
    plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      }),
      new webpack.NoErrorsPlugin()
    );
  }

  var devServer = _.clone({
    stats: {
      cached: false,
      exclude: excludeFromStats
    }
  });

  _.assign(devServer, options.devServer || {});

  var config = {
    context: options.context || __dirname,
    entry: options.entry,
    output: options.output,
    target: options.prerender ? "node" : "web",
    module: {
      loaders: [].concat(loadersByExtension(loaders)).concat(loadersByExtension(stylesheetLoaders)).concat(additionalLoaders)
    },
    devtool: options.devtool,
    debug: options.debug,
    resolveLoader: {
      root: path.join(__dirname, "../node_modules"),
      modulesDirectories: modulesDirectories,
      alias: aliasLoader
    },
    externals: externals,
    resolve: {
      root: rootPath,
      modulesDirectories: modulesDirectories,
      extensions: extensions,
      alias: alias
    },
    plugins: (options.plugins || []).concat(plugins),
    devServer: devServer
  };
  return (config);
};

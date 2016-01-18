var host = 'localhost';
var webpackPort = 9090;
var meteorPort = 3030;

module.exports = {
  dev: true,
  host: host,
  webpackPort: webpackPort,
  meteorPort: meteorPort,
  baseUrl: 'http://' + host + ':' + webpackPort,
  contentBase: 'http://' + host + ':' + meteorPort
};

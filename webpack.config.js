const path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'runner.js'
  }
  //plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new webpack.optimize.DedupePlugin()]
};
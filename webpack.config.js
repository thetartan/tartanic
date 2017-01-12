'use strict';

var webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/scripts/index.js'
  },
  output: {
    filename: '[name].js',
    path: './public/scripts'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.html$/, loader: 'raw'},
      {test: /\.json$/, loader: 'json'},
      // Evaluate every @([a-z0-9-_].js and bundle pre-calculated exports
      // as a value. This allows to omit some file(s) from bundle.
      {test: /[\\/]@[-_a-zA-Z0-9]+\.js$/, loaders: ['raw', 'val']},
      // Mock this file as it is very large and anyway we do not use it
      {test: require.resolve('unicode/category/So'), loader: 'null'}
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};

'use strict'

const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: [path.join(__dirname, 'client/source', 'client.js')],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'client/source'),
        exclude: path.join(__dirname, 'node_modules'),
      },
    ],
  },
}

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    content: './src/content.js',
    popup: './src/popup.js',
    background: './src/background.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions', 'ie >= 11']
                }
              }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'popup.html', to: 'popup.html' },
        { from: 'popup-styles.css', to: 'popup-styles.css' },
        { from: 'styles.css', to: 'styles.css' },
        { from: 'icons', to: 'icons' }
      ]
    }),
  ],
  resolve: {
    fallback: {
      "crypto": false,
      "stream": false,
      "util": false,
      "buffer": false,
      "process": false,
      "fs": false,
      "path": false,
      "os": false,
      "net": false,
      "tls": false,
      "child_process": false,
      "vm": false
    }
  },
  optimization: {
    minimize: false
  }
};

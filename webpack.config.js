/* global require module __dirname */
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  entry: [
    './src/index.tsx',
  ],

  output: {
    clean: true,
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'docs'),
  },

  resolve: {
    extensions: [ '.ts', '.js', '.tsx', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },

  devtool: 'source-map',

  devServer: {
    'static': {
      directory: '.dist/',
    },
    host: '0.0.0.0',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
    }),
    new BundleAnalyzerPlugin({
      logLevel: 'error',
      analyzerMode: 'static',
      reportFilename: path.join(__dirname, '.bundle_analysis.html'),
      openAnalyzer: false,
    }),
  ],
}

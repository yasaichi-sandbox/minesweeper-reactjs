const cssnext = require('postcss-cssnext');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const saveLicense = require('uglify-save-license');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  devServer: {
    contentBase: './dist',
    inline: true
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  entry: {
    app: './src/index.jsx'
  },
  output: {
    path: './dist',
    filename: 'javascripts/[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', [
          'css?modules&minimize',
          'postcss'
        ])
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: saveLicense }
    }),
    new ExtractTextPlugin('stylesheets/app.css')
  ],
  postcss: [
    cssnext
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};

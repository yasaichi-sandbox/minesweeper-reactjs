const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const saveLicense = require('uglify-save-license');

module.exports = {
  context: __dirname,
  devServer: {
    contentBase: './dist',
    inline: true
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map',
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
        ])
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ output: { comments: saveLicense } }),
    new ExtractTextPlugin('stylesheets/[name].css')
  ]
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};

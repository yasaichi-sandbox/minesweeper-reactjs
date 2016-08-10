const webpack = require('webpack');
const saveLicense = require('uglify-save-license');

module.exports = {
  context: __dirname,
  devServer: {
    contentBase: './dist'
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map',
  entry: {
    app: './src/javascripts/main.jsx'
  },
  output: {
    path: './dist',
    filename: 'javascripts/[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ output: { comments: saveLicense } })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
};

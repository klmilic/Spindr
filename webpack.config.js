const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new Dotenv(),
  ],
  devServer: {
    allowedHosts: 'all',
    // static: {
    //   directory: path.resolve(__dirname, 'dist'),
    //   publicPath: '/dist',
    // },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
    historyApiFallback: true,
    // headers: {
    //   'Access-Control-Allow-Origin': 'http://localhost:8080',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Headers':
    //     'X-Requested-With, content-type, Authorization',
    // }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,

        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
          }
          },
        ],
      },
      {         
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
      },
    ],
  },
};

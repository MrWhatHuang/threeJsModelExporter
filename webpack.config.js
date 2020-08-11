/*
 * @Descripttion:
 * @version:
 * @Author: Mr.What
 * @Date: 2020-08-10 17:37:58
 * @LastEditors: Mr.What
 * @LastEditTime: 2020-08-11 11:08:25
 */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAassetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      //   options: {
      //     fix: true
      //   }
      // },
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      }, {
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env'),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
    // 分离css文件
    new MiniCssExtractPlugin(),
    // 压缩css
    new OptimizeCssAassetsWebpackPlugin(),
  ],
  mode: 'development',
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    open: true,
    // hot: true,
    compress: true,
    port: 8081,
  },
  devtool: 'eval-source-map'
};

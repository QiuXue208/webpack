const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'production'

module.exports = {
  mode,
  entry: {
    main: './src/index.js',
    admin: './src/admin.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx']
    }),
    mode === 'production' && new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      chunks: ['admin']
    }),
    new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
  devServer: {
    hot: true
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          priority: 10,
          chunks: 'all', // all表示同步和异步加载
          minSize: 0, // 如果不写0，由于React太小，会直接跳过
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors'
        },
        common: {
          priority: 5,
          name: 'common',
          minSize: 0,
          minChunks: 2,
          chunks: 'all', // all表示同步和异步加载
        }
      },
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'icss'
              },
            }
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: `
                @import "~@/styles/vars.scss";
              `,
              sassOptions: {
                includePaths: [__dirname]
              }
            },
          }
        ]
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  }
}
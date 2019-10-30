
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const devConfig = {
    mode: 'production',
    plugins: [
        // webpack 3.0 可以直接使用 css-loader1.0 传入参数直接压缩，css-loader1.0后不支持这样做，需要安装
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new HtmlWebpackExternalsPlugin({
            externals: [
              {
                module: 'react',
                entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
                global: 'React',
              },
              {
                module: 'react-dom',
                entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
                global: 'ReactDOM',
              },
            ],
          })
    ],
    optimization: {
        splitChunks: {
          minSize: 0,
          cacheGroups: {
            commons: {
              name: 'vendors',
              chunks: 'all',
              minChunks: 2,
            },
          },
        },
    }
}

module.exports = merge(baseConfig, devConfig);
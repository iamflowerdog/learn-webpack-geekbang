'use strict';

const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HappyPack = require('happypack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, 'src')
}
const smp = new SpeedMeasurePlugin();
const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
    // Users/yang/Desktop/my-project/src/index/index.js
    
    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];
            let match = entryFiles[index].match(/src\/(.*)\/index.js/);
            let pageName = match && match[1];

            entry[pageName] = entryFile;
            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, `src/${pageName}/index.html`),
                    filename: `${pageName}.html`,
                    chunks: ['vendors', pageName],
                    inject: true,
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false
                    }
                })
            )
        });
    return {
        entry,
        htmlWebpackPlugins
    }
}

const { entry, htmlWebpackPlugins } = setMPA();
const prodConfig = {
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'js/[name]_[chunkhash:8].js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /.js$/,
                // 只解析src里面的js文件 第三方引入的告诉babel-loader不解析，因为一般人家都自动解析好了
                include: path.resolve('src'),
                use: [
                    'happypack/loader',
                    // {
                    //     loader: 'thread-loader',
                    //     options: {
                    //         workers: 3
                    //     }
                    // },
                    // 'babel-loader',
                    // 'eslint-loader'
                ]
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    // All tools will find target browsers automatically, when you add the following to package.json:
                                    // browsers: ["last 2 version", ">1%", "IOS 7"]
                                })
                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,
                            remPrecision: 8
                        }
                    },
                    'less-loader',
                ]
            },
            {
                test: /.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'image/[name]_[hash:8].[ext]'
                        }
                    },
                    // {
                    //     loader: 'image-webpack-loader',
                    //     options: {
                    //         mozjpeg: {
                    //             progressive: true,
                    //             quality: 65
                    //         },
                    //         // optipng.enabled: false will disable optipng
                    //         optipng: {
                    //             enabled: false,
                    //         },
                    //         pngquant: {
                    //             quality: '65-90',
                    //             speed: 4
                    //         },
                    //         gifsicle: {
                    //             interlaced: false,
                    //         },
                    //         // the webp option will enable WEBP
                    //         webp: {
                    //             quality: 75
                    //         }
                    //     }
                    // }
                ]
            },
            {
                test: /.(woff|woff2|eot|otf|ttf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8][ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            environment: JSON.stringify('prod')
        }),
        // 分析压缩后文件的体积
        // new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[contenthash:8].css'
        }),
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'react',
        //             entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
        //             global: 'React',
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
        //             global: 'ReactDOM',
        //         },
        //     ],
        // }),
        ...htmlWebpackPlugins,
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        // 代码压缩，多个scope合并成一个，生产模式会自动创建
        // new webpack.optimize.ModuleConcatenationPlugin(),
        function () {
            this.hooks.done.tap('done', (stats) => {
                if (stats.compilation.errors &&
                    stats.compilation.errors.length && process.argv.indexOf('- -watch') == -1) {
                    console.log('build error');
                    process.exit(1);
                }
            })
        },
        new webpack.DllReferencePlugin({
            manifest: require('./build/library/library.json')
        }),
        new AddAssetHtmlPlugin({
            filepath: path.resolve(__dirname, 'build/library/*.dll.js'),
        }),
        new HappyPack({
            loaders: ['babel-loader?cacheDirectory=true']
        }),
        new HardSourceWebpackPlugin(),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
        })
    ],
    devtool: '',
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //           commons: {
    //               test: /(react|react-dom)/,
    //               name: 'vendors',
    //               chunks: 'all'
    //           }
    //         }
    //       }
    // },
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                cache: true
            }),
        ],
    },
    resolve: {
        alias: {
            'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js')
        },
        modules: [path.resolve(__dirname, 'node_modules')],
        extensions: ['.js'],
        mainFields: ['main']
    },
    stats: 'errors-only'
}

module.exports = prodConfig;

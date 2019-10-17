# learn_webpack_geekbang
极客时间学习

## 学习笔记

* webpack loader 调用链式调用 执行顺序从右往左，先去解析less 再传递给css 再传递给style

```
    module: {
        rules: [
            test: '.less$/',
            use: [
                'style-loader', // build last
                'css-loader',
                'less-loader' // build first 
            ]
        ]
    }
```
* url-loader 可以把图片转成base64，可以减少http请求，优化页面加载性能

#### webpack --watch 和 WDS的区别？

* webpack --watch 文件监听把文件更新到本地磁盘，性能不好，构建之后要手动刷新
    - 轮训判断文件的最后编辑时间是否有变化
    ```
        module.exports = {
            //...
            watchOptions: {
                // 监听到变化发生后会等300ms再去执行，默认300ms
                aggregateTimeout: 300, 
                // 每1000ms去轮训一次
                poll: 1000
            }
        };
    ```
* webpack-dev-server 
    - WDS 没有磁盘的IO，在内存里面
    - WDS 不刷新浏览器
    - 使用HMR插件

####  webpack热更新原理

1. Webpack Compile: 将JS编译成Bundle
2. HMR Server: 将热更新的文件输出给HMR Runtime
3. Bundle server: 提供文件在浏览器的访问
4. HMR Runtime: 会被注入到浏览器，更新文件的变化
5. bundle.js: 构建输出文件

#### 文件指纹如何生成

* hash ---> complie: {complier: xxx}

#### PostCSS 的 autoprefixer 插件

* parse CSS
* add vendor prefixer to CSS using value from Can I Use.

#### px2rem-loader flexible 

* html 根结点的大小计算，可以使用html: {font-size: calc(100vw/固定分辨率)}
* 手淘这个库可以比较方便的解决手机端1px问题
* px2rem-loader 可以设置 exclude ，把不需要转换的比如 node_modules 里面的模块去掉
如果不设置exclude 也可以使用 /*no*/的语法设置某一行不进行px2rem的转换操作
* flexible 一定要内敛进html文件里面，页面打开的时候就需要马上计算根结点的font-size值，如果不内敛可能存在闪动的情况

#### Mulity Page Application basic reslove solution

* 每个页面对应一个Entry，一个 html-webpack-plugin (每次新增或者删除页面需要改webpack的配置)；
* 利用 glob.sync 动态获取入口js文件 然后动态设置entry和html-webpack-plugin 
* `entry:glob.sync(path.join(__dirname, './src/*/index.js'))`

#### source-map

* devtool的几种方法
    1. eval: 使用eval包裹模块代码
    2. source-map: 产生.map文件和.js文件是分离的
    3. cheap: 不包含列的错误信息
    4. inline: 将.map作为DataURI嵌入，不单独生成.map文件
    5. module: 包含loader的sourecmap

* source-map文件 整个文件就是js对象
```
{
　　version : 3, // Source map的版本，目前为3。
　　file: "out.js", // 转换后的js文件名
　　sourceRoot : "", // 转换后js文件所在的目录。如果和map文件在同一层，则为空
　　sources: ["foo.js", "bar.js"], // 转换前的js文件，数组类型，可能是多个js文件
　　names: ["src", "maps", "are", "fun"], // 转换前所有变量名和属性名
　　mappings: "AAgBC,SAAQ,CAAEA" // 记录位置信息的字符串
}
```
* 生产环境不建议直接使用 source-map 但是这种情况下，线上报错我们该如何调试
    利用公司的前端监控系统，一旦报错，可以把 sourcemap 上传到这个监控系统里面，但是不要把sourcemap文件和静态资源文件的 cdn 一起发布到线上就好了

#### split base library

* use `html-wabpck-externals-plugin` 
    [api](https://www.npmjs.com/package/html-webpack-externals-plugin)

* use `SplitChunksPlugin`

#### webpack.optimize.ModuleConcatenationPlugin 优化通过es6 import 的js文件
* 大量作用域包裹代码，导致体积增大
* 运行代码时创建的函数作用域变多，内存开销变大
* DCE dead code elimination
* Scope Hoisting 多个作用域用一个作用域替代，但是又一个前提，模块引用大于1次时候，这个效果无效，引用多次的模块在被webpack处理时，会被独立包裹函数所包裹

#### tree-shaking 优化 es6 import的没用的变量 擦除在uglify阶段

#### 懒加载JS脚本的方式

1. CommonJS: require.ensure
2. ES6: 动态import(目前还没有原生支持，需要babel转换)
    * use: @babel/plugin-syntax-dynamic-import
    * 内部通过webpackJsonp方式创建一个script标签



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

* eval: 使用eval包裹模块代码
* source-map: 产生.map文件和.js文件是分离的
* cheap: 不包含列的错误信息
* inline: 将.map作为DataURI嵌入，不单独生成.map文件
* module: 包含loader的sourecmap
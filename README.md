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
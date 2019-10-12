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
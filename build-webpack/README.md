### 构建配置抽离成npm包
##### 意义
1. 通用性 
    * 业务开发者无需关注构建配置
    * 统一团队构建脚本
2. 可维护性
    * 构建配置合理拆分
    * README文档、ChangeLog文档
3. 质量
    * 冒烟测试、单元测试、测试覆盖率
    * 持续集成

##### 构建包功能设计结构
* lib 目录下面放置源代码 下面所用到的依赖要放在安装到dependencies里面
* test 放置测试代码 所用到的依赖要安装到devDependencies里面
![图片](https://github.com/iamflowerdog/learn_webpack_geekbang/blob/master/assert/WX20191030-141858.png)

##### 使用ESLint规范构建脚本
* 使用eslint-config-airbnb-base 插件
* eslint --fix 可以自动处理空格
* vscode 右下角spaces 可以处理当前文件的tab缩进
* .eslintrc.js 里面通过 rules: {} 里面可以修改配置

##### 冒烟测试
* 用webpack函数来处理 webpack(prodConfig, (err, stats) => void);
* process.chdir(), 然后webpack.base.js里面修改当前所在目录
* 删除eslint
* 构建是否成功 build目录是否有内容输出
* 引入mocha进行初步测试是否有html和css、js文件生成，引入glob-all同步获取文件

##### 单元测试
* 引入mocha单元测试，引入assert断言库来判断
* 引入istanbul测试覆盖率，通过nyc方法检查测试覆盖率

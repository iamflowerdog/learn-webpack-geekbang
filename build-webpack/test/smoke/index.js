
const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
    timeout: '10000'
})
process.chdir(path.join(__dirname, 'template'));

rimraf('./dist', () => {
    const prodConfig = require('../../lib/webpack.prod');
    /**
     * declare function webpack(
            options: webpack.Configuration, 
            handler: webpack.Compiler.Handler
        ): webpack.Compiler.Watching | webpack.Compiler;
        type Handler = (err: Error, stats: Stats) => void;
     */
    // webpack 函数第一个参数接受配置文件，第二个回调函数用来处理打包后结果
    webpack(prodConfig, (err, stats) => {
        if (err) {
            console.error(err);
            process.exit(2)
        } 
        console.log(stats.toString({
            colors: true,
            modules: false,
            children: false
        }));
        mocha.addFile(path.join(__dirname, './html-test.js'));
        mocha.addFile(path.join(__dirname, './css-js-test.js'));
        mocha.run();
    })
})
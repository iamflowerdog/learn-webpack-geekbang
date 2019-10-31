
const assert = require('assert');

describe('webpack.base.js unit case', () => {
    const baseConfig = require('../../lib/webpack.base');
    it('entry', () => {
        assert.equal(baseConfig.entry.index, '/Users/yang/Code/learn_webpack_geekbang/build-webpack/test/smoke/template/src/index/index.js');
        assert.equal(baseConfig.entry.search, '/Users/yang/Code/learn_webpack_geekbang/build-webpack/test/smoke/template/src/search/index.js');
    })
})
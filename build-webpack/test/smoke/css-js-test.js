const glob = require('glob-all');

describe('checking generated js css', function () {
    it('js css yes!', function (done) {
        const files = glob.sync(
            [
                './dist/js/index_*.js',
                './dist/js/search_*.js',
                './dist/css/index*.css',
                './dist/css/search_*.css',
            ]
        );
        if (files.length > 0) {
            done()
        } else {
            throw new Error('no js css!');
        }
    })
});
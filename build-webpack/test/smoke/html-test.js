
const glob = require('glob-all');

describe('checking generated html', function () {
    it('html yes!', function (done) {
        const files = glob.sync(
            [
                './dist/index.html',
                './dist/search.html'
            ]
        );
        if (files.length > 0) {
            done()
        } else {
            throw new Error('no html!');
        }
    })
});


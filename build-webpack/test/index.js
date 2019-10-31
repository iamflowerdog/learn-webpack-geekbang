const path = require('path');

process.chdir(path.join(__dirname, 'smoke/template'));

describe('test webpack.base.js', () => {
    require('./unit/webpack.base.test');
})
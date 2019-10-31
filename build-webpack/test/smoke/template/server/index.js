
if (typeof window === 'undefined') {
    global.window = {}
}

const fs = require('fs');
const path = require('path');
const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server');
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8');
const data = require('./data.json');


const server = (port) => {
    const app = express();

    // 设置静态目录
    app.use(express.static('dist'));

    // 路由
    app.get('/search', (req, res) => {
        const html = renderMarkeup(renderToString(SSR));
        res.status(200).send(html);
    });
    
    app.listen(port, () => {
        console.log('Server is running on port:' + port);
    });
}

// 设置端口
server(process.env.PORT || 3000);

const renderMarkeup = (str) => {
    const dataStr = JSON.stringify(data);
    return template.replace('<!--HTML_PLACEHOLDER-->', str)
                    .replace('<!--INITIAL_DATA_PLACEHOLDER-->', `<script>window.__inintial__data=${dataStr}</script>`)
}


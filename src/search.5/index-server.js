// import React from 'react';
// import { a } from './tree-shaking';
// // import '../../common/common';
// import largerNumberAdd from 'larger-number-add';
// import './search.less';
// import logo from './image/logo.png';

const React = require('react');
const { a } = require('./tree-shaking');
const largerNumberAdd = require('larger-number-add');
const logo = require('./image/logo.png');
require('./search.less');

class Search extends React.Component {
    constructor () {
        super(...arguments);
        this.state = {
            Text: null
        }
    }
    handleDynamicImport () {
        import('./text.js').then((Text) => {
            this.setState({
                Text: Text.default
            })
        })
    }
    render () {
        const { Text } = this.state;
        return (
            <div className="search-text" >
                { a() }
                { Text ? <Text/> : null}
                { largerNumberAdd("345", "456") }
                <span className="text">中国汉字牛逼888</span> 
                <img src={ logo } onClick={this.handleDynamicImport.bind(this)}/>
            </div>
        )
    }
}

module.exports = <Search/>;

import React from 'react';
import ReactDOM from 'react-dom';
import './search.less';
import logo from './image/logo.png';

class Search extends React.Component {
    render () {
        return (
            <div className="search-text" >
                <span className="text">中国汉字</span> 
                <img src={ logo } />
            </div>
        )
    }
}

ReactDOM.render(
    <Search/>,
    document.getElementById('root')
)

import React from 'react';
import ReactDOM from 'react-dom';
import './search.less';

class Search extends React.Component {
    render () {
        return (
            <div className="search-text" >
                <span className="text">hello react!</span> 
            </div>
        )
    }
}

ReactDOM.render(
    <Search/>,
    document.getElementById('root')
)

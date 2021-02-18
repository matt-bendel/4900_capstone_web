import React from 'react';
import '../App.css';

export default class Home extends React.Component {
    constructor(props) {
        super(props)
    }

    render(){
        return (
            <h1>Welcome {this.props.user}</h1>
        );
    }
}
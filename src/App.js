import React from 'react'

import logo from './logo.svg';
import './App.css';
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import DeviceLink from "./components/DeviceLink";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      linked: false,
    }
  }

  render() {
    return (
        <div className="App">
          <header className="App-header">
            {this.state.authenticated ? this.state.linked ? (<Home />) : (<DeviceLink />) : (<SignUp />)}
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
    );
  }
}

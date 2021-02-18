import React from 'react'

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
          </header>
          <div className="break" />
          <div className="body">
            {/*{this.state.authenticated ? this.state.linked ? (<Home />) : (<DeviceLink />) : (<SignUp />)}*/}
            <Home user={"Matt"}/>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <linearGradient id="grad1">
              <stop offset="44%" style={{stopColor: "var(--primary-color)", stopOpacity: 1}} />
              <stop offset="94%" style={{stopColor: "var(--secondary-color)", stopOpacity: 1}} />
            </linearGradient>
            <path className="wave" d="M0,128L48,154.7C96,181,192,235,288,245.3C384,256,480,224,576,197.3C672,171,768,149,864,170.7C960,192,1056,256,1152,261.3C1248,267,1344,213,1392,186.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z">
            </path>
          </svg>
        </div>
    );
  }
}

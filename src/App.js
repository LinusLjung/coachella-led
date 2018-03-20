import React, { Component } from 'react';
import * as storage from './util/localstorage';

import './App.css';

import Screen from './components/Screen';
import Controls from './components/Controls';

class App extends Component {
  componentWillMount() {
    this.setState({
      screen: {
        width: storage.getValue('width') || 200,
        height: storage.getValue('height') || 300,
        count: storage.getValue('count') || 1
      }
    });
  }

  setScreenProp(key, value) {
    storage.setValue(key, value);

    this.setState({
      screen: {
        ...this.state.screen,
        [key]: value
      }
    });
  }

  setScreenWidth = (width) => {
    this.setScreenProp('width', width);
  };

  setScreenHeight = (height) => {
    this.setScreenProp('height', height);
  };

  setScreenCount = (count) => {
    this.setScreenProp('count', count);
  };

  render() {
    return (
      <div className='app'>
        <Screen { ...this.state.screen } />
        <Controls
          width={ this.state.screen.width }
          height={ this.state.screen.height }
          count={ this.state.screen.count }
          setWidth={ this.setScreenWidth }
          setHeight={ this.setScreenHeight }
          setCount={ this.setScreenCount }
        />
      </div>
    );
  }
}

export default App;

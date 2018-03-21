import React, { Component } from 'react';
import * as storage from './util/localstorage';
import * as media from './media';

import './App.css';

import Screen from './components/Screen';
import Controls from './components/Controls';

class App extends Component {
  componentWillMount() {
    this.setState({
      screen: {
        width: storage.getValue('width') || 200,
        height: storage.getValue('height') || 300,
        count: storage.getValue('count') || 1,
        media: storage.getValue('media'),
        overlay: {
          color: storage.getValue('color') || '#000',
          opacity: storage.getValue('opacity') || 0
        }
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

  setScreenOverlayProp(key, value) {
    storage.setValue(key, value);

    this.setState({
      screen: {
        ...this.state.screen,
        overlay: {
          ...this.state.screen.overlay,
          [key]: value
        }
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

  setMedia = (media) => {
    this.setScreenProp('media', media);
  };

  setColor = (color) => {
    this.setScreenOverlayProp('color', color);
  }

  setOpacity = (opacity) => {
    this.setScreenOverlayProp('opacity', opacity);
  }

  render() {
    return (
      <div className='app'>
        <Screen { ...this.state.screen } />
        <Controls
          width={ this.state.screen.width }
          height={ this.state.screen.height }
          count={ this.state.screen.count }
          media={ media }
          selectedMedia={ this.state.screen.media }
          color={ this.state.screen.overlay.color }
          opacity={ this.state.screen.overlay.opacity }
          setWidth={ this.setScreenWidth }
          setHeight={ this.setScreenHeight }
          setCount={ this.setScreenCount }
          setMedia={ this.setMedia }
          setColor={ this.setColor }
          setOpacity={ this.setOpacity }
        />
      </div>
    );
  }
}

export default App;

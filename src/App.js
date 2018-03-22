import React, { Component } from 'react';
import * as storage from './util/localstorage';
import * as media from './media';

import './App.css';

import Screen from './components/Screen';
import Controls from './components/Controls';

class App extends Component {
  messageHandlers = {
    SET_WIDTH: data => this.setScreenWidth(data.value),
    SET_HEIGHT: data => this.setScreenHeight(data.value),
    SET_COUNT: data => this.setScreenCount(data.value),
    SET_MEDIA: data => this.setMedia(data.value),
    SET_OVERLAY_COLOR: data => this.setColor(data.value),
    SET_OVERLAY_OPACITY: data => this.setOpacity(data.value),
  };

  componentWillMount() {
    this.setState({
      screen: {
        width: storage.getValue('width') || 200,
        height: storage.getValue('height') || 300,
        count: storage.getValue('count') || 1,
        media: storage.getValue('media'),
        overlay: {
          color: storage.getValue('color') || '#000000',
          opacity: storage.getValue('opacity') || 0
        }
      }
    });

    this.connectToServer('localhost', this.handleServerConnect);
  }

  connectToServer(ip, callback = f => f) {
    const ws = this.ws = new WebSocket('ws://' + ip + ':8080');

    ws.addEventListener('open', (e) => {
      console.log(e);
      callback();
    });

    ws.addEventListener('error', function (e) {
      console.log(e);
    });
  }

  getId() {
    let id = storage.getValue('id');

    if (!id) {
      id = Math.ceil(Math.random() * 10000);
      storage.setValue('id', id);
    }

    return id;
  }

  handleServerConnect = () => {
    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);

      switch (data.type) {
        case 'GET_DATA':
          this.sendMessage('DATA', {
            ...this.state,
            media
          });
          break;

        default:
          try {
            this.messageHandlers[data.type](data);
          } catch (e) {
            console.log('Message handler not found for type ' + data.type);
          }
      }

      console.log(e);
    });

    this.sendMessage('CLIENT_TYPE', {
      type: 'host',
      id: this.getId()
    });
  };

  sendMessage(type, value) {
    this.ws.send(JSON.stringify({
      type,
      value
    }));
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

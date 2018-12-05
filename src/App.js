import React, { Component } from 'react';
import * as storage from './util/localstorage';
import media from './media';
import uniqueNamesGenerator from 'unique-names-generator';
import debounce from 'debounce';

import './App.css';

import Screen from './components/Screen';
import Controls from './components/Controls';

class App extends Component {
  static defaultScreen = {
    width: 200,
    height: 300,
    count: 1,
    media: media,
    selectedMedia: null,
    overlay: {
      color: '#000000',
      opacity: 0,
    },
  };

  state = {
    screens: {},
  };

  constructor(props) {
    super(props);

    this.id = this.getId();
  }

  componentWillMount() {
    this.setState({
      screens: storage.getJSONValue('screens') || (this.isScreen() ? {
        [this.getId()]: App.defaultScreen,
      } : {}),
    });

    this.connectToServer(process.env.REACT_APP_MASTER_HOST, this.handleServerConnect);
  }

  connectToServer(ip, callback = f => f) {
    const ws = this.ws = new WebSocket('ws://' + ip + ':' + process.env.REACT_APP_MASTER_PORT);

    ws.addEventListener('open', (e) => {
      console.log(e);
      callback();
    });

    ws.addEventListener('error', function (e) {
      console.log(e);
    });
  }

  getId() {
    let id = this.id || storage.getValue('id');

    if (!id) {
      if (this.isScreen()) {
        id = this.id = uniqueNamesGenerator.generate('-');
        storage.setValue('id', id);
      } else {
        id = this.id = this.getSelectedScreenId();
      }
    }

    return id;
  }

  getSelectedScreenId() {
    return this.isScreen() ? this.id : window.location.pathname.substring(1);
  }

  getScreen() {
    return this.state.screens[this.getId()];
  }

  handleServerConnect = () => {
    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);

      console.log(data);

      switch (data.action) {
        case 'SET_SCREEN_STATE':
          const { id, action, ...restData } = data;
          storage.setScreen(id, restData.screen);
          this.setScreen(id, restData.screen);

          break;

        case 'GET_SCREENS':
          this.setState({
            screens: data.screens,
          });

          break;

        case 'REGISTER_SCREEN':
          this.setState({
            screens: {
              ...this.state.screens,
              [data.id]: data.screen,
            },
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

    if (this.isScreen()) {
      this.sendMessage('REGISTER_SCREEN', {
        screen: this.state.screens[this.getId()],
        id: this.getId(),
      });
    } else {
      this.sendMessage('GET_SCREENS');
    }
  };

  isScreen() {
    return window.location.pathname === '/screen';
  }

  pushState = debounce(function () {
    this.sendMessage('SET_SCREEN_STATE', {
      screen: this.state.screens[this.getId()],
      id: this.getId(),
    })
  }, 100);

  sendMessage(action, payload) {
    try {
      this.ws.send(JSON.stringify({
        action,
        ...payload,
      }));
    } catch (e) {
      console.log(e);
    }
  }

  setScreen(id, screen) {
    this.setState({
      screens: {
        ...this.state.screens,
        [id]: screen,
      },
    });
  }

  setScreenProp(key, value) {
    this.setState({
      screens: {
        ...this.state.screens,
        [this.getId()]: {
          ...this.state.screens[this.getId()],
          [key]: value,
        },
      }
    }, () => {
      this.pushState();

      storage.setScreen(this.getId(), this.getScreen());
    });
  }

  setScreenOverlayProp(key, value) {
    this.setState({
      screens: {
        ...this.state.screens,
        [this.getId()]: {
          ...this.state.screens[this.getId()],
          overlay: {
            ...this.state.screens[this.getId()].overlay,
            [key]: value,
          },
        }
      },
    }, () => {
      this.pushState();

      storage.setScreen(this.getId(), this.getScreen());
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
    this.setScreenProp('selectedMedia', media);
  };

  setColor = (color) => {
    this.setScreenOverlayProp('color', color);
  };

  setOpacity = (opacity) => {
    this.setScreenOverlayProp('opacity', opacity);
  };

  render() {
    const screen = this.getScreen();

    return (
      <div className='app'>
        { screen ? (
          [
            this.isScreen() ? <Screen key={ 1 } { ...screen } /> : null,

            <Controls
              key={ 2 }
              id={ this.getId() }
              isScreen={ this.isScreen() }
              width={ screen.width }
              height={ screen.height }
              count={ screen.count }
              media={ screen.media }
              selectedMedia={ screen.selectedMedia }
              color={ screen.overlay.color }
              opacity={ screen.overlay.opacity }
              setWidth={ this.setScreenWidth }
              setHeight={ this.setScreenHeight }
              setCount={ this.setScreenCount }
              setMedia={ this.setMedia }
              setColor={ this.setColor }
              setOpacity={ this.setOpacity }
            />
          ]
        ) : (
          <div>
            { Object.keys(this.state.screens).map(function (id) {
              return (
                <a key={ id } className='app-screen-link' href={`/${id}`}>{ id }</a>
              );
            }) }
          </div>
        ) }
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './css.css';

class Screen extends Component {
  getWidth(props = this.props) {
    return `${props.width * props.count}px`;
  }

  getHeight(props = this.props) {
    return `${props.height}px`;
  }

  render() {
    return (
      <div
        className='screen'
        style={ {
          width: this.getWidth(),
          height: this.getHeight(),
        } }
      >
        <img class="screen-media" src='http://via.placeholder.com/200x300' />
      </div>
    );
  }
}

export default Screen;

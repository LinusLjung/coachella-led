import React, { Component } from 'react';
import './css.css';
import path from 'path';

class Screen extends Component {
  getWidth(props = this.props) {
    return `${props.width * props.count}px`;
  }

  getHeight(props = this.props) {
    return `${props.height}px`;
  }

  renderMedia(media) {
    switch (path.extname(media)) {
      case '.mp4':
        return <video className='screen-media' src={ media } autoPlay muted loop />
      default:
        return <img className='screen-media' src={ media } alt={ media } />;
    }
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
        { !!this.props.media && this.renderMedia(this.props.media) }
        <div
          className='screen-overlay'
          style={ {
            backgroundColor: this.props.overlay.color,
            opacity: this.props.overlay.opacity
          } }
        />
      </div>
    );
  }
}

export default Screen;

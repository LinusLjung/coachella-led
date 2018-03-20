import React, { Component } from 'react';
import './css.css';

class Controls extends Component {
  handleWidthChange = e => {
    const value = e.currentTarget.value;

    if (!value) {
      return;
    }

    this.props.setWidth(Number(value));
  };

  handleHeightChange = e => {
    const value = e.currentTarget.value;

    if (!value) {
      return;
    }

    this.props.setHeight(Number(value));
  };

  handleCountChange = e => {
    const value = e.currentTarget.value;

    if (!value) {
      return;
    }

    this.props.setCount(Number(value));
  };

  render() {
    return (
      <div className='controls'>
        <div className='input-wrap'>
          <label htmlFor='inputWidth'>Width</label>
          <input
            type='number'
            id='inputWidth'
            value={ this.props.width }
            onChange={ this.handleWidthChange }
          />
        </div>

        <div className='input-wrap'>
          <label htmlFor='inputHeight'>Height</label>
          <input
            type='number'
            id='inputHeight'
            value={ this.props.height }
            onChange={ this.handleHeightChange }
          />
        </div>

        <div className='input-wrap'>
          <label htmlFor='inputCount'>Count</label>
          <input
            type='number'
            id='inputCount'
            value={ this.props.count }
            onChange={ this.handleCountChange }
          />
        </div>
      </div>
    );
  }
}

export default Controls;

import React, { Component } from 'react';
import Canvas from './canvas/Canvas';

export default class Jack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawingCable: false,
    };
  }
  getPosition() {
    const {
      left,
      top,
      right,
      bottom,
    } = this.startPoint.getBoundingClientRect();
    const x = (left + right) / 2;
    const y = (top + bottom) / 2;
    return { x, y };
  }
  connectCable(cableUuid) {
    const {
      uuid,
    } = this.props;
    fetch(`http://localhost:8080/jack/${uuid}/connectCable/${cableUuid}`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
      })
  }
  onMouseDown = () => {
    Canvas.onJackClicked(this);
  }
  onMouseUp = () => {
    Canvas.onMouseUpOnJack(this);
  }
  render() {
    return (
      <div
        ref={(startPoint) => { this.startPoint = startPoint; }}
        style={{
          'user-select': 'none',
        }}
        onMouseDown={() => this.onMouseDown()}
        onMouseUp={() => this.onMouseUp()}
      >
        MyNameIsJackBlack!
      </div>
    );
  }
}
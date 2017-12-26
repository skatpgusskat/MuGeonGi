import React, { Component } from 'react';
import styled from 'styled-components';
import Canvas from './canvas/Canvas';
import Menu from './Menu';
import restore from './utils/restore';
import Setting from './Setting';

let onInstrumentElementCreatedHandler;
export function onInstrumentElementCreated(element) {
  if (onInstrumentElementCreatedHandler) {
    onInstrumentElementCreatedHandler(element);
  }
}

const Container = styled.div`
  overflow: hidden;
`;
const PlayGround = styled.div`
  width: calc(100vw - 100px);
  height: 70%;
  border: 1px solid red;
  left: 100px;
  position: fixed; /* Stay in place */  
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      instruments: [],
    };
    onInstrumentElementCreatedHandler = (element) => {
      this.setState({
        instruments: [
          ...this.state.instruments,
          element,
        ],
      });
    };
    restore()
      .catch(err => console.log(err));
  }
  render() {
    return (
      <Container>
        <Menu />
        <PlayGround
          className="App"
          onMouseUp={() => Canvas.onMouseUp()}
        >
          {this.state.instruments}
        </PlayGround >
        <Setting />
      </Container>
    );
  }
}

export default App;

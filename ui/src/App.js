import React, { Component } from 'react';
import createInstrument from './server/createInstrument';
import Mic from './Mic';
import Speaker from './Speaker';
import Canvas from './canvas/Canvas';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      instruments: [],
    };
    createInstrument('mic')
      .then((props) => {
        console.log(props);
        this.setState({
          instruments: this.state.instruments.concat(<Mic {...props} />),
        });
      });
    createInstrument('speaker')
      .then((props) => {
        console.log(props);
        this.setState({
          instruments: this.state.instruments.concat(<Speaker {...props} />),
        });
      });
  }
  render() {
    return (
      <div
        className="App"
        onMouseUp={() => Canvas.onMouseUp()}
      >
        {this.state.instruments}
      </div >
    );
  }
}

export default App;
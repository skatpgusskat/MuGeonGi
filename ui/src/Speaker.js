import React, { Component } from 'react';
import Box from './Box';
import Jack from './Jack';

export default class Speaker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
    };
    const {
      uuid,
    } = props;
    fetch(`http://localhost:8080/speaker/${uuid}/devices`)
      .then(res => res.json())
      .then(devices => this.setState({ devices: ['', ...devices] }));
  }
  componentWillUnmount() {
    const { uuid } = this.props;
    fetch(`http://localhost:8080/instrument/${uuid}`, {
      method: 'delete',
    })
      .then(res => console.log(`delete speaker : ${res.status}`));
  }
  setDevice = (device) => {
    console.log(device);
    if (device.length <= 0) {
      return;
    }
    const { uuid } = this.props;
    this.setState({
      device,
    });
    fetch(`http://localhost:8080/speaker/${uuid}/device/${device}`, {
      method: 'post',
    })
      .then(res => console.log(`set device of speaker : ${res.status}`));
  }
  render() {
    const {
      devices,
      selectedDevice,
    } = this.state;
    const options = devices.map(device => <option value={device}>{device}</option>);
    return (
      <Box>
        Speaker
        Device:
        <select
          style={{ width: '100%' }}
          onChange={(event) => this.setDevice(event.target.value)}
          value={selectedDevice}
        >
          {options}
        </select>
        <Jack />
      </Box>
    );
  }
}

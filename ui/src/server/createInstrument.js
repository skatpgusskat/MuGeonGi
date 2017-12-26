import React from 'react';
import { findInstrument } from '../instruments/Instrument';
import instrumentClassMap from '../utils/instrumentClassMap';
import { onInstrumentElementCreated } from '../App';

export default instrument =>
  fetch(`http://localhost:8080/${instrument}`, {
    method: 'POST',
  })
    .then(res => res.json())
    .then((props) => {
      const instrumentClass = instrumentClassMap[instrument];
      const element = React.createElement(instrumentClass, props, null);
      onInstrumentElementCreated(element);
      return findInstrument(props.uuid);
    });

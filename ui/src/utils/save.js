import { instrumentList, stateMap } from '../instruments/Instrument';
import { cableList } from '../canvas/Cable';
import { findSingleBox } from '../instruments/SingleBox';

let isSaveBlocked = false;
export function blockSave() {
  isSaveBlocked = true;
}

const fs = window.require('fs');

async function saveInstruments() {
  const instrumentData = instrumentList.map(instrument => ({
    name: instrument.constructor.name,
    props: instrument.props,
    state: stateMap[instrument.props.uuid],
  }));

  await Promise.all(instrumentList.map(async (instrument, index) => {
    const singleBox = await findSingleBox(instrument.props.uuid);
    const { x, y } = singleBox.draggable.state;
    instrumentData[index].x = x;
    instrumentData[index].y = y;
  }));

  return instrumentData;
}

export default function save() {
  return new Promise(async (resolve, reject) => {
    if (isSaveBlocked) {
      resolve();
      return;
    }
    const instrumentData = await saveInstruments();

    const cableData = cableList.map((cable) => {
      const startJack = cable.startJack
        ? { uuid: cable.startJack.props.uuid }
        : undefined;
      const endJack = cable.endJack
        ? { uuid: cable.endJack.props.uuid }
        : undefined;
      return {
        uuid: cable.uuid,
        startJack,
        endJack,
      };
    });
    const string = JSON.stringify({
      instruments: instrumentData,
      cableList: cableData,
    }, null, 2);

    fs.writeFile('.save', string, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

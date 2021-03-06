import createInstrument from '../server/createInstrument';
import createCable from '../server/createCable';
import { findJack } from '../instruments/Jack';
import { findSingleBox } from '../instruments/SingleBox';

const fs = window.require('fs');

async function restoreInstruments(instruments) {
  const newInstrumentMap = {};
  await Promise.all(instruments.map(async (instrument) => {
    const newInstrument = await createInstrument(instrument.name);

    const singleBox = await findSingleBox(newInstrument.props.uuid);
    const { x, y } = instrument;
    singleBox.setDefaultPosition(x, y);

    if (instrument.state) {
      await Promise.all(Object.keys(instrument.state).map(async (key) => {
        const method = `set${key.slice(0, 1).toUpperCase()}${key.slice(1)}`;
        const param = instrument.state[key];
        await newInstrument[method](param);
      }));
    }
    newInstrumentMap[instrument.props.uuid] = newInstrument;
  }));
  return newInstrumentMap;
}

async function restoreCables({
  cableList,
  oldInstruments,
  newInstrumentMap, // old UUID, new Instrument Instance
}) {
  await Promise.all(cableList.map(async (cable) => {
    if (!cable.startJack || !cable.endJack) {
      return;
    }
    let newStartJack;
    let newEndJack;
    await Promise.all(oldInstruments.map(async (instrument) => {
      const jacksNames = ['inputJacks', 'outputJacks'];
      await Promise.all(jacksNames.map(async (jacksName) => {
        if (instrument.props[jacksName]) {
          const newInstrument = newInstrumentMap[instrument.props.uuid];
          instrument.props[jacksName].forEach(async (jack, index) => {
            const jackUuid = jack.uuid;
            const newJacks = newInstrument.props[jacksName];
            const newJackUuid = newJacks[index].uuid;
            const newJack = await findJack(newJackUuid);
            if (jackUuid === cable.startJack.uuid) {
              newStartJack = newJack;
            } else if (jackUuid === cable.endJack.uuid) {
              newEndJack = newJack;
            }
          });
        }
      }));
    }));
    const newCable = await createCable();
    await newCable.setStartJack(newStartJack);
    await newCable.setEndJack(newEndJack);
  }));
}

export default function restore() {
  return new Promise((resolve, reject) => {
    fs.readFile('.save', 'utf8', async (err, data) => {
      if (err) {
        return reject(err);
      }
      try {
        const {
          instruments,
          cableList,
        } = JSON.parse(data);

        const newInstrumentMap = await restoreInstruments(instruments);

        restoreCables({
          cableList,
          oldInstruments: instruments,
          newInstrumentMap,
        });
        return resolve();
      } catch (err2) {
        return reject(err2);
      }
    });
  });
}

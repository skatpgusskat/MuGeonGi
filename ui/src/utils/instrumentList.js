const list = [];
const eventHandlers = [];

export default list;

export function addInstrument(instrument) {
  list.push(instrument);
  eventHandlers.forEach(handler => handler(list));
}

export function removeInstrument(instrument) {
  // TODO
}

export function onInstrumentAdded(eventHandler) {
  eventHandlers.push(eventHandler);
}

import xs from 'xstream';
import { getDisplayKey, getDisplayChar } from './utils';


function makeKeyboardDriver() {
  function keyboardDriver() {
    const keyDown$ = xs.create();
    const keyUp$ = xs.create();
    const keyPress$ = xs.create();
    document.addEventListener('keydown', event =>
      keyDown$.shamefullySendNext(Object.assign(event, {
        displayKey: getDisplayKey(event)
      })));
    document.addEventListener('keyup', event =>
      keyUp$.shamefullySendNext(Object.assign(event, {
        displayKey: getDisplayKey(event)
      })));
    document.addEventListener('keypress', event =>
      keyPress$.shamefullySendNext(Object.assign(event, {
        displayKey: getDisplayKey(event),
        displayChar: getDisplayChar(event)
      })));
    const shift$ = xs.merge(
      keyDown$
        .filter(e => e.displayKey == 'shift')
        .map(e => true),
      keyUp$
        .filter(e => e.displayKey == 'shift')
        .map(e => false)
    ).startWith(null);
    var capsLock = null;
    const capsLock$ = xs.merge(
      keyDown$
        .filter(e => capsLock != null && e.displayKey == 'caps lock')
        .map(e => {
          capsLock = !capsLock;
          return capsLock;
        }),
      keyPress$
        .filter(e => {
          var chr = getDisplayChar(e);
          if (!chr || chr.toLowerCase() == chr.toUpperCase())
            return false;
          return true;
        }).map(e => {
          var chr = getDisplayChar(e);
          capsLock = (chr.toLowerCase() == chr && e.shiftKey) || (chr.toUpperCase() == chr && !e.shiftKey);
          return capsLock;
        })
    ).startWith(capsLock);
    const sinks = {
      keyDown$,
      keyUp$,
      keyPress$,
      shift$,
      capsLock$
    };
    return sinks;
  }
  return keyboardDriver;
}

module.exports = { makeKeyboardDriver };
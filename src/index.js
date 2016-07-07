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
        .map(x => true),
      keyUp$
        .filter(e => e.displayKey == 'shift')
        .map(x => false)
      ).startWith(null);
    const sinks = {
      down$: keyDown$,
      up$: keyUp$,
      press$: keyPress$,
      shift$,
    };
    return sinks;
  }
  return keyboardDriver;
}

module.exports = { makeKeyboardDriver };
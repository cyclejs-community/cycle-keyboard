import xs from 'xstream';
import { getDisplayKey } from './utils';


function makeKeyboardDriver() {
  function keyboardDriver() {
    const keyDown$ = xs.create();
    const keyUp$ = xs.create();
    const keyPress$ = xs.create();
    document.addEventListener('keydown', event => keyDown$.shamefullySendNext(Object.assign({displayKey: getDisplayKey(event)}, event)));
    document.addEventListener('keyup', event => keyUp$.shamefullySendNext(Object.assign({displayKey: getDisplayKey(event)}, event)));
    document.addEventListener('keypress', event => keyPress$.shamefullySendNext(Object.assign({displayKey: getDisplayKey(event)}, event)));
    const sinks = {
      down$: keyDown$,
      up$: keyUp$,
      press$: keyPress$
    };
    return sinks;
  }
  return keyboardDriver;
}

module.exports = { makeKeyboardDriver };
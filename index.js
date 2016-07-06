import "babel-polyfill";
import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { div, ul, li, span, makeDOMDriver } from '@cycle/dom';
import { makeKeyboardDriver } from 'cycle-keyboard';
import { keys, drawKey, allowedKeyCodes } from './keyboard';

function main({ dom, keyboard }) {
  const shiftKeyDown$ = keyboard.down$.filter(e => e.displayKey == 'shift').map(x => true);
  const shiftKeyUp$ = keyboard.up$.filter(e => e.displayKey == 'shift').map(x => false);
  const shifted$ = xs.merge(shiftKeyDown$, shiftKeyUp$).startWith(false);
  const keyDownId$ = keyboard.down$.map(e => e.event.keyCode);
  const keyUpId$ = keyboard.up$.map(e => -e.event.keyCode).startWith(0);
  const keysDown$ = xs.merge(keyDownId$, keyUpId$).fold((keys, id) => {
    keys = keys || [];
    if (!id)
      return keys;
    if (id < 0) {
      id *= -1;
      var index = keys.indexOf(id);
      if (index !== -1)
        keys.splice(index, 1);
      return keys;
    }
    var index = keys.indexOf(id);
    if (index !== -1)
      return keys;
    keys.push(id);
    return keys;
  }, []);
  const keyDownMessage$ = keyboard.down$.map(e => {
    if(allowedKeyCodes.indexOf(e.event.keyCode) === -1)
      e.event.preventDefault();
    return `${e.displayKey} key is down`;
  });
  const keyPressMessage$ = keyboard.press$.map(e => `${e.displayChar} is pressed`);
  const keyUpMessage$ = keyboard.up$.map(e => {
    if(allowedKeyCodes.indexOf(e.event.keyCode) === -1)
      e.event.preventDefault();
    return `${e.displayKey} key is up`;
  });
  const message$ = xs.merge(keyDownMessage$, keyPressMessage$, keyUpMessage$).startWith(null);
  const messages$ = message$.fold((messages, message) => {
    messages = messages || [];
    if (!message)
      return messages;
    messages.push(message);
    return messages;
  }, []);
  const state$ = xs.combine(messages$, shifted$, keysDown$).map(a => {
    return { messages: a[0], shifted: a[1], keysDown: a[2] }
  });
  const vtree$ = state$.map(state =>
    div('#root', [
      div('.container', [
        div('.messages', [
          ul('.log', state.messages.map(message => li([message]))),
        ]),
        div('.keyboard', [
          div('.panel', keys.map(k => drawKey(k, state)))
        ])
      ])
    ])
  );
  const sinks = {
    dom: vtree$
  };
  return sinks;
}
const drivers = {
  dom: makeDOMDriver('#app'),
  keyboard: makeKeyboardDriver()
}
run(main, drivers);
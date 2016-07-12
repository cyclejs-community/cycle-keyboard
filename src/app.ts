import { Stream } from 'xstream';
import { run } from '@cycle/xstream-run';
import { div, ul, li, span, makeDOMDriver } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { makeKeyboardDriver, KeyboardDriver } from 'cycle-keyboard';
import { keys, drawKey, allowedKeyCodes } from './keyboard';

interface ISources {
  dom: DOMSource,
  keyboard: KeyboardDriver 
}

function main(sources: ISources) {
  const xs = Stream;
  const keyboard = sources.keyboard;
  const keyDownId$ = keyboard.keyDown$.map(e => e.keyCode);
  const keyUpId$ = keyboard.keyUp$.map(e => -e.keyCode).startWith(0);
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
  const keyDownMessage$ = keyboard.keyDown$.map(e => {
    if (allowedKeyCodes.indexOf(e.keyCode) === -1
      || (allowedKeyCodes.indexOf(e.keyCode) !== -1 && e.ctrlKey))
      e.preventDefault();
    return `${e.displayKey} key is down`;
  });
  const keyPressMessage$ = keyboard.keyPress$.map(e => `${e.displayChar} is pressed`);
  const keyUpMessage$ = keyboard.keyUp$.map(e => {
    if (allowedKeyCodes.indexOf(e.keyCode) === -1
      || (allowedKeyCodes.indexOf(e.keyCode) !== -1 && e.ctrlKey))
      e.preventDefault();
    return `${e.displayKey} key is up`;
  });
  const message$ = xs.merge(keyDownMessage$, keyPressMessage$, keyUpMessage$).startWith(null);
  const messages$ = message$.fold((messages, message) => {
    messages = messages || [];
    if (!message)
      return messages;
    if (messages.length == 5)
      messages.splice(0, 1);
    messages.push(message);
    return messages;
  }, []);
  const state$ = xs.combine(messages$, keyboard.shift$, keyboard.capsLock$, keysDown$).map(a => {
    return { messages: a[0], shift: a[1], capsLock: a[2], keysDown: a[3] }
  });
  const vtree$ = state$.map(state =>
    div('#root', [
      div('.container', [
        div('.messages', [
          ul('.log', state.messages.length ? state.messages.map(message => li('.message', message)) : [
            li('.message', 'use the keyboard')
          ]),
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

run(main, {
  dom: makeDOMDriver('#app'),
  keyboard: makeKeyboardDriver()
});
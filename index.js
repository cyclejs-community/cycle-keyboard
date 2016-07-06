import "babel-polyfill";
import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { div, label, input, hr, ul, li, makeDOMDriver } from '@cycle/dom';
import { makeKeyboardDriver } from 'cycle-keyboard';

function main({ dom, keyboard }) {
  const keyDown$ = keyboard.down$.map(e => `${e.displayKey} key is down`);
  const keyPress$ = keyboard.press$.map(e => `${e.displayKey} key is pressed, ${e.displayChar} is typed`);
  const keyUp$ = keyboard.up$.map(e => `${e.displayKey} key is up`);
  const message$ = xs.merge(keyDown$, keyPress$, keyUp$).startWith(null);
  const messages$ = message$.fold((messages, message) => {
    if (!message)
      return messages || [];
    messages.push(message);
    return messages;
  }, []);
  const vtree$ = messages$.map(messages =>
    div('#root', [
      div('.messages.container', [
        ul('.log', messages.map(message => li([message]))),
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
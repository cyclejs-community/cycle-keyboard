import "babel-polyfill";
import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { div, label, input, hr, ul, li, makeDOMDriver } from '@cycle/dom';
import { makeKeyboardDriver } from 'cycle-keyboard';

function main({ dom, keyboard }) {
  const keyDown$ = keyboard.down$.map(x => `${x.keyCode} keydown`);
  const keyPress$ = keyboard.press$.map(x => `${x.charCode} keypress`);
  const keyUp$ = keyboard.up$.map(x => `${x.keyCode} keyup`);
  const message$ = xs.merge(keyDown$, keyPress$, keyUp$).startWith(null);
  const messagelist$ = message$.fold(((list, message) => list.push(message)), []);
  const vtree$ = messagelist$.map(messages =>
    div('#root', [
      label('Type here:'),
      input({ attributes: { type: 'text' } }),
      hr(),
      ul('.log', messages.map(message => li([message]))),
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
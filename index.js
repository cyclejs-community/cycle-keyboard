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
  const keys$ = xs.of({
    func: [
      {
        name: 'esc',
        shift: 'esc',
        down: false
      },
      {
        name: 'f1',
        shift: 'f1',
        down: false
      },
      {
        name: 'f2',
        shift: 'f2',
        down: false
      },
      {
        name: 'f3',
        shift: 'f3',
        down: false
      },
      {
        name: 'f4',
        shift: 'f4',
        down: false
      },
      {
        name: 'f5',
        shift: 'f5',
        down: false
      },
      {
        name: 'f6',
        shift: 'f6',
        down: false
      },
      {
        name: 'f7',
        shift: 'f7',
        down: false
      },
      {
        name: 'f8',
        shift: 'f8',
        down: false
      },
      {
        name: 'f9',
        shift: 'f9',
        down: false
      },
      {
        name: 'f10',
        shift: 'f10',
        down: false
      },
      {
        name: 'f11',
        shift: 'f11',
        down: false
      },
      {
        name: 'f12',
        shift: 'f12',
        down: false
      }
    ],
    alpha: [
      {
        name: '`',
        shift: '~',
        down: false,
        alt: 'tilde'
      },
      {
        name: '1',
        shift: '!',
        down: false,
      },
      {
        name: '2',
        shift: '@',
        down: false
      },
      {
        name: '3',
        shift: '#',
        down: false
      },
      {
        name: '4',
        shift: '$',
        down: false
      },
      {
        name: '5',
        shift: '%',
        down: false
      },
      {
        name: '6',
        shift: '^',
        down: false
      },
      {
        name: '7',
        shift: '&',
        down: false
      },
      {
        name: '8',
        shift: '*',
        down: false
      },
      {
        name: '9',
        shift: '(',
        down: false
      },
      {
        name: '0',
        shift: ')',
        down: false
      },
      {
        name: '-',
        shift: '_',
        down: false,
        alt: 'hyphen'
      },
      {
        name: '+',
        shift: '=',
        down: false,
        alt: 'plus'
      },
      {
        name: '<-',
        shift: '<-',
        down: false,
        alt: 'backspace'
      }
    ],
    nav: [],
    numpad: []
  });
  const state$ = xs.combine(messages$, keys$);
  const vtree$ = state$.map(state =>
    div('#root', [
      div('.container', [
        div('.messages', [
          ul('.log', state[0].map(message => li([message]))),
        ]),
        div('.keyboard', [
          div('.panel', [
            div('.function.keys', state[1].func.map(k =>
              div(`.${k.alt || k.name}.key`, k.name)
            )),
            div('.main.section', [
              div('.alphanumeric.keys', state[1].alpha.map(k =>
                div(`.${k.alt || k.name}.key`, k.name)
              )),
              div('.navigation.keys', state[1].nav.map(k =>
                div(`.${k.alt || k.name}.key`, k.name)
              )),
              div('.numpad.keys', state[1].numpad.map(k =>
                div(`.${k.alt || k.name}.key`, k.name)
              )),
            ])
          ])
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
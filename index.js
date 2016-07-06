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
        down: false
      },
      {
        name: 'f1',
        down: false
      },
      {
        name: 'f2',
        down: false
      },
      {
        name: 'f3',
        down: false
      },
      {
        name: 'f4',
        down: false
      },
      {
        name: 'f5',
        down: false
      },
      {
        name: 'f6',
        down: false
      },
      {
        name: 'f7',
        down: false
      },
      {
        name: 'f8',
        down: false
      },
      {
        name: 'f9',
        down: false
      },
      {
        name: 'f10',
        down: false
      },
      {
        name: 'f11',
        down: false
      },
      {
        name: 'f12',
        down: false
      }
    ],
    status: [
      {
        name: 'pscr',
        down: false
      },
      {
        name: 'slock',
        down: false
      },
      {
        name: 'pause',
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
        down: false,
        alt: 'backspace'
      },
      {
        name: 'tab',
        down: false,
      },
      {
        name: 'q',
        shift: 'Q',
        down: false
      },
      {
        name: 'w',
        shift: 'W',
        down: false
      },
      {
        name: 'e',
        shift: 'E',
        down: false
      },
      {
        name: 'r',
        shift: 'R',
        down: false
      },
      {
        name: 't',
        shift: 'T',
        down: false
      },
      {
        name: 'y',
        shift: 'Y',
        down: false
      },
      {
        name: 'u',
        shift: 'U',
        down: false
      },
      {
        name: 'i',
        shift: 'I',
        down: false
      },
      {
        name: 'o',
        shift: 'O',
        down: false
      },
      {
        name: 'p',
        shift: 'P',
        down: false
      },
      {
        name: '[',
        shift: '{',
        down: false,
        alt: 'square.braces.open'
      },
      {
        name: ']',
        shift: '}',
        down: false,
        alt: 'square.braces.close'
      },
      {
        name: '\\',
        shift: '|',
        down: false,
        alt: 'slash'
      },
      {
        name: 'caps',
        down: false,
      },
      {
        name: 'a',
        shift: 'A',
        down: false
      },
      {
        name: 's',
        shift: 'S',
        down: false
      },
      {
        name: 'd',
        shift: 'D',
        down: false
      },
      {
        name: 'f',
        shift: 'F',
        down: false
      },
      {
        name: 'g',
        shift: 'G',
        down: false
      },
      {
        name: 'h',
        shift: 'H',
        down: false
      },
      {
        name: 'j',
        shift: 'J',
        down: false
      },
      {
        name: 'k',
        shift: 'K',
        down: false
      },
      {
        name: 'l',
        shift: 'L',
        down: false
      },
      {
        name: ';',
        shift: ':',
        down: false,
        alt: 'colon'
      },
      {
        name: '\'',
        shift: '"',
        down: false,
        alt: 'quotes'
      },
      {
        name: 'enter',
        down: false
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
            div('.additional.section', [
              div('.function.keys', state[1].func.map(k =>
                div(`.${k.alt || k.name}.key`, k.name)
              )),
              div('.status.keys', state[1].status.map(k =>
                div(`.${k.alt || k.name}.key`, k.name)
              ))
            ]),
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
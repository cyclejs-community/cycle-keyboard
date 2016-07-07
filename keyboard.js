import { div, span } from '@cycle/dom';

const keys = [
    {
      name: 'esc',
      code: 27
    },
    {
      name: 'f1',
      code: 112
    },
    {
      name: 'f2',
      code: 113
    },
    {
      name: 'f3',
      code: 114
    },
    {
      name: 'f4',
      code: 115
    },
    {
      name: 'f5',
      code: 116
    },
    {
      name: 'f6',
      code: 117
    },
    {
      name: 'f7',
      code: 118
    },
    {
      name: 'f8',
      code: 119
    },
    {
      name: 'f9',
      code: 120
    },
    {
      name: 'f10',
      code: 121
    },
    {
      name: 'f11',
      code: 122
    },
    {
      name: 'f12',
      code: 123
    },
    {
      name: 'pscr',
      code: 44
    },
    {
      name: 'slock',
      code: 145
    },
    {
      name: 'pause',
      code: 19
    },
    {
      name: '`',
      shift: '~',
      alt: 'tilde',
      code: 192,
      alt_code: 223
    },
    {
      name: '1',
      shift: '!',
      alt: 'one',
      code: 49
    },
    {
      name: '2',
      shift: '@',
      alt: 'two',
      code: 50
    },
    {
      name: '3',
      shift: '#',
      alt: 'three',
      code: 51
    },
    {
      name: '4',
      shift: '$',
      alt: 'four',
      code: 52
    },
    {
      name: '5',
      shift: '%',
      alt: 'five',
      code: 53
    },
    {
      name: '6',
      shift: '^',
      alt: 'six',
      code: 54
    },
    {
      name: '7',
      shift: '&',
      alt: 'seven',
      code: 55
    },
    {
      name: '8',
      shift: '*',
      alt: 'eight',
      code: 56
    },
    {
      name: '9',
      shift: '(',
      alt: 'nine',
      code: 57
    },
    {
      name: '0',
      shift: ')',
      alt: 'zero',
      code: 48
    },
    {
      name: '-',
      shift: '_',
      alt: 'hyphen',
      code: 189,
      alt_code: 173
    },
    {
      name: '=',
      shift: '+',
      alt: 'equals',
      code: 187,
      alt_code: 59,
      alt_code_2: 61
    },
    {
      name: '<-',
      alt: 'backspace',
      code: 8
    },
    {
      name: 'pgup',
      code: 33
    },
    {
      name: 'home',
      code: 36
    },
    {
      name: 'ins',
      code: 45
    },
    {
      name: 'num lock',
      code: 144
    },
    {
      name: '/',
      alt: 'num.divide',
      code: 111
    },
    {
      name: '*',
      alt: 'num.multiply',
      code: 106
    },
    {
      name: '-',
      alt: 'num.subtract',
      code: 109
    },
    {
      name: 'tab',
      code: 9
    },
    {
      name: 'q',
      code: 81
    },
    {
      name: 'w',
      code: 87
    },
    {
      name: 'e',
      code: 69
    },
    {
      name: 'r',
      code: 82
    },
    {
      name: 't',
      code: 84
    },
    {
      name: 'y',
      code: 89
    },
    {
      name: 'u',
      code: 85
    },
    {
      name: 'i',
      code: 73
    },
    {
      name: 'o',
      code: 79
    },
    {
      name: 'p',
      code: 80
    },
    {
      name: '[',
      shift: '{',
      alt: 'square.braces.open',
      code: 219
    },
    {
      name: ']',
      shift: '}',
      alt: 'square.braces.close',
      code: 221
    },
    {
      name: '\\',
      shift: '|',
      alt: 'backslash',
      code: 220
    },
    {
      name: 'pgdn',
      code: 34
    },
    {
      name: 'end',
      code: 35
    },
    {
      name: 'del',
      code: 46
    },
    {
      name: '7',
      alt: 'num.seven',
      code: 103
    },
    {
      name: '8',
      alt: 'num.eight',
      code: 104
    },
    {
      name: '9',
      alt: 'num.nine',
      code: 105
    },
    {
      name: 'caps',
      code: 20
    },
    {
      name: 'a',
      code: 65
    },
    {
      name: 's',
      code: 83
    },
    {
      name: 'd',
      code: 68
    },
    {
      name: 'f',
      code: 70
    },
    {
      name: 'g',
      code: 71
    },
    {
      name: 'h',
      code: 72
    },
    {
      name: 'j',
      code: 74
    },
    {
      name: 'k',
      code: 75
    },
    {
      name: 'l',
      code: 76
    },
    {
      name: ';',
      shift: ':',
      alt: 'semi.colon',
      code: 186
    },
    {
      name: '\'',
      shift: '"',
      alt: 'quotes',
      code: 222
    },
    {
      name: 'enter',
      code: 13
    },
    {
      name: '4',
      alt: 'num.four',
      code: 100
    },
    {
      name: '5',
      alt: 'num.five',
      code: 101
    },
    {
      name: '6',
      alt: 'num.six',
      code: 102
    },
    {
      name: '+',
      alt: 'num.add',
      code: 107
    },
    {
      name: 'shift',
      code: 16
    },
    {
      name: 'z',
      code: 90
    },
    {
      name: 'x',
      code: 88
    },
    {
      name: 'c',
      code: 67
    },
    {
      name: 'v',
      code: 86
    },
    {
      name: 'b',
      code: 66
    },
    {
      name: 'n',
      code: 78
    },
    {
      name: 'm',
      code: 77
    },
    {
      name: ',',
      shift: '<',
      alt: 'comma',
      code: 188
    },
    {
      name: '.',
      shift: '>',
      alt: 'period',
      code: 190
    },
    {
      name: '/',
      shift: '?',
      alt: 'slash',
      code: 191
    },
    {
      name: 'shift',
      alt: 'right.shift',
      code: 16
    },
    {
      name: '^',
      alt: 'up.arrow',
      code: 38
    },
    {
      name: '1',
      alt: 'num.one',
      code: 97
    },
    {
      name: '2',
      alt: 'num.two',
      code: 98
    },
    {
      name: '3',
      alt: 'num.three',
      code: 99
    },
    {
      name: 'ctrl',
      code: 17
    },
    {
      name: 'alt',
      code: 18
    },
    {
      name: 'win',
      code: 91
    },
    {
      name: 'space',
      code: 32
    },
    {
      name: 'win',
      code: 91
    },
    {
      name: 'alt',
      code: 18
    },
    {
      name: 'ctrl',
      alt: 'right.ctrl',
      code: 17
    },
    {
      name: '<',
      alt: 'left.arrow',
      code: 37
    },
    {
      name: 'dn',
      alt: 'down.arrow',
      code: 40
    },
    {
      name: '>',
      alt: 'right.arrow',
      code: 39
    },
    {
      name: '0',
      alt: 'num.zero',
      code: 96
    },
    {
      name: '.',
      alt: '.num.period',
      code: 110,
      alt_code: 194,
      alt_code_2: 108
    },
    {
      name: 'enter',
      alt: 'num.enter',
      code: 13
    }
  ];

function drawKey(key, state) {
  var classNames = '';
  if (state.shift)
    classNames += '.shifted';
  classNames += '.' + (key.alt || key.name);
  var index = state.keysDown.indexOf(key.code);
  if (index === -1)
    index = state.keysDown.indexOf(key.alt_code);
  if (index === -1)
    index = state.keysDown.indexOf(key.alt_code_2);
  if (index !== -1)
    classNames += '.pressed';
  classNames += '.key';
  if(state.capsLock && key.name == 'caps')
    classNames += '.locked';
  var isAlphabet = key.name.length === 1
    && 'abcdefghijklmnopqrstuvwxyz'.split('').indexOf(key.name) !== -1;
  return div(classNames, [
    span([state.shift
      ? (isAlphabet 
        ? (state.capsLock ? key.name : key.name.toUpperCase())
        : key.shift || key.name)
      : (isAlphabet
        ? (state.capsLock
          ? key.name.toUpperCase() : key.name)
        : key.name)])
  ]);
}

const allowedKeyCodes = [
    // 0-9
    48,
    49,
    60,
    51,
    52,
    53,
    54,
    55,
    56,
    57,

    // -, =
    187,
    189,

    // a-z
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,

    // caps, shift
    20,
    16,

    // braces and backslash
    219,
    221,
    220,

    // semi-colon, quotes, comma, period, slash
    186,
    222,
    188,
    190,
    191,

    // numpad
    110,
    194,
    108,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    109,
    111,

    // tilde
    192,
    223,
];

module.exports = { keys, drawKey, allowedKeyCodes };
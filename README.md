# cycle-keyboard
A keyboard driver for cycle.js.

[![npm version](https://img.shields.io/npm/v/cycle-keyboard.svg)](https://img.shields.io/npm/v/cycle-keyboard.svg)[![license](https://img.shields.io/github/license/artfuldev/cycle-keyboard.svg)](https://img.shields.io/github/license/artfuldev/cycle-keyboard.svg)

## Usage
Install the package using node package manager
```
$ npm install cycle-keyboard
```
Import the driver in your cycle app
```
import { makeKeyboardDriver } from 'cycle-keyboard'
...
const drivers = {
  ...
  keyboard: makeKeyboardDriver()
}
```
Subscribe to `keyup`, `keydown` and `keypress` event streams on `document`
```
function main({ dom, keyboard}) {
  const keyUp$ = keyboard.up$.map(ev => ev.displayKey + ' was pressed');
}
```

## Notes
The driver provides the streams as `up$`, `down$`, and `press$`(read $ as `stream`). These streams are xstream streams.

The events emitted include the original event in the `event` property, and an additional `displayKey` property which is a string representation of the key used in the events. The `keypress` event has an additional `displayChar` property which is a string of the character that was typed.

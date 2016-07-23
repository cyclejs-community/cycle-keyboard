# cycle-keyboard
A keyboard driver for cycle.js. [View Demo](https://cyclejs-community.github.io/cycle-keyboard)

[![npm version](https://img.shields.io/badge/npm-v1.0.0--rtm.2-orange.svg)](https://img.shields.io/badge/npm-v1.0.0--rtm.2-orange.svg)[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io/badge/license-MIT-blue.svg)

## Usage
Install the package using node package manager
```
$ npm install cycle-keyboard@1.0.0-rtm.2
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
Subscribe to keyboard-related event streams on the driver
```
function main({ ..., keyboard }) {
  const keyUp$ = keyboard.keyUp$.map(ev => ev.displayKey + ' was pressed');
}
```
The driver provides the following [xstream](https://github.com/staltz/xstream) streams:
* `keyUp$`, a stream of all keyup events emitted on the document, with an additional `displayKey` property,
* `keyDown$`, a stream of all keydown events emitted on the document, with an additional `displayKey` property,
* `keyPress$`, a stream of all keypress events emitted on the document, with additional `displayKey` and `displayChar` properties,
* `shift$`, a stream of booleans indicating if the shift key is held down, and
* `capsLock$`, a stream of booleans indicating if the caps lock is on

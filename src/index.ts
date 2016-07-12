import xs from 'xstream';
import { getDisplayKey, getDisplayChar } from './utils';
import { KeyboardEventProducer, KeyboardStatusProducer } from './producers';

function makeKeyboardDriver() {

  const keyDownEventProducer = new KeyboardEventProducer('keydown',
    event => Object.assign(event, {
      displayKey: getDisplayKey(event)
    }));

  const keyUpEventProducer = new KeyboardEventProducer('keyup',
    event => Object.assign(event, {
      displayKey: getDisplayKey(event)
    }));

  const keyPressEventProducer = new KeyboardEventProducer('keypress',
    event => Object.assign(event, {
      displayKey: getDisplayKey(event),
      displayChar: getDisplayChar(event)
    }));

  class KeyboardDriver {
    
    constructor() {
      const _this = this;
      this.keyDown$ = xs.create(keyDownEventProducer);
      this.keyUp$ = xs.create(keyUpEventProducer);
      this.keyPress$ = xs.create(keyPressEventProducer);
      const shiftProducer = new KeyboardStatusProducer(
        xs.merge(
          _this.keyDown$
            .filter(e => e.displayKey == 'shift')
            .map(e => true),
          _this.keyUp$
            .filter(e => e.displayKey == 'shift')
            .map(e => false)
        ).startWith(null));
      var capsLock = null;
      const capsLockProducer = new KeyboardStatusProducer(
        xs.merge(
          _this.keyDown$
            .filter(e => capsLock != null && e.displayKey == 'caps lock')
            .map(e => {
              capsLock = !capsLock;
              return capsLock;
            }),
          _this.keyPress$
            .filter(e => {
              var chr = getDisplayChar(e);
              if (!chr || chr.toLowerCase() == chr.toUpperCase())
                return false;
              return true;
            }).map(e => {
              var chr = getDisplayChar(e);
              capsLock = (chr.toLowerCase() == chr && e.shiftKey) || (chr.toUpperCase() == chr && !e.shiftKey);
              return capsLock;
            })
        ).startWith(capsLock));
      this.shift$ = xs.create(shiftProducer);;
      this.capsLock$ = xs.create(capsLockProducer);
    }
  }

  function keyboardDriver() {
    return new KeyboardDriver();
  }
  return keyboardDriver;
}

module.exports = { makeKeyboardDriver };
import xs from 'xstream';
import { getDisplayKey, getDisplayChar } from './utils';


function makeKeyboardDriver() {

  class KeyboardEventProducer {
    constructor(type, mapper) {
      
      // hold onto this reference
      const _this = this;

      this.start = function (listener) {
        _this.stream = listener;
        document.addEventListener(type, _this.handler);
      };
      this.stop = function () {
        document.removeEventListener(type, _this.handler);
        _this.stream = null;
      };
      this.stream = null;
      this.handler = event => _this.stream.next(mapper(event));
    }
  }

  class StreamListener {
    constructor(producer) {
      this.next = ev => producer.stream.next(ev),
      this.error = err => console.error(err),
      this.complete = () => { }
    }
  }

  class KeyboardStatusProducer {
    constructor(stream) {
      const _this = this;
      this.stream = null;
      this.source$ = stream;
      this.streamListener = new StreamListener(this);
      this.start = function (listener) {
        _this.stream = listener;
        _this.source$.addListener(_this.streamListener);
      };
      this.stop = () => _this.source$.removeListener(_this.streamListener);
    }
  }

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
              _this.capsLock = (chr.toLowerCase() == chr && e.shiftKey) || (chr.toUpperCase() == chr && !e.shiftKey);
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
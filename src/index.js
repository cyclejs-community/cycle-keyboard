import xs from 'xstream';
import { getDisplayKey, getDisplayChar } from './utils';


function makeKeyboardDriver() {

  const KeyboardEventProducer = function (type, mapper) {
    return {
      start: function (listener) {
        this.stream = listener;
        document.addEventListener(type, this.handler);
      },
      stop: function () {
        document.removeEventListener(type, this.handler);
        this.stream = null;
      },
      stream: null,
      handler: function (event) {
        if (this.stream)
          this.stream.next(mapper(event));
      }
    }
  }

  const StreamListener = function(producer) {
    return {
        next: ev => {
          if(producer && producer.stream)
            producter.stream.next(ev);
        },
        error: err => console.error(err),
        complete: () => { }
      }
  }

  const KeyboardStatusProducer = function (stream) {
    const producer = {};
    Object.assign(producer, {streamListener = StreamListener(producer)});
    Object.assign(producer,
    {
      start: function (listener) {
        this.stream = listener;
        this.source$.addListener(this.streamListener);
      },
      stop: function () {
        this.source$.removeListener(this.streamListener);
      },
      streamListener: StreamListener(this),
      stream: null,
      source$: stream
    });
    return producer;
  }

  const keyDownEventProducer = KeyboardEventProducer('keydown',
    event => Object.assign(event, {
      displayKey: getDisplayKey(event)
    }));

  const keyUpEventProducer = KeyboardEventProducer('keyup',
    event => Object.assign(event, {
      displayKey: getDisplayKey(event)
    }));

  const keyPressEventProducer = KeyboardEventProducer('keypress',
    event => Object.assign(event, {
      displayKey: getDisplayKey(event),
      displayChar: getDisplayChar(event)
    }));

  function keyboardDriver() {
    const keyDown$ = xs.create(keyDownEventProducer);
    const keyUp$ = xs.create(keyUpEventProducer);
    const keyPress$ = xs.create(keyPressEventProducer);
    const shiftProducer = KeyboardStatusProducer(
      xs.merge(
        keyDown$
          .filter(e => e.displayKey == 'shift')
          .map(e => true),
        keyUp$
          .filter(e => e.displayKey == 'shift')
          .map(e => false)
      ).startWith(null));
    var capsLock = null;
    const capsLockProducer = KeyboardStatusProducer(
      xs.merge(
        keyDown$
          .filter(e => capsLock != null && e.displayKey == 'caps lock')
          .map(e => {
            capsLock = !capsLock;
            return capsLock;
          }),
        keyPress$
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
    const shift$ = xs.create(shiftProducer);
    const capsLock$ = xs.create(capsLockProducer);
    const sinks = {
      keyDown$,
      keyUp$,
      keyPress$,
      shift$,
      capsLock$
    };
    return sinks;
  }
  return keyboardDriver;
}

module.exports = { makeKeyboardDriver };
import { Stream } from 'xstream';
import { getDisplayKey, getDisplayChar, ExtendedKeyboardEvent } from './utils';
import { KeyboardEventProducer, KeyboardStatusProducer } from './producers';


const keyDownEventProducer = new KeyboardEventProducer('keydown',
  (event: KeyboardEvent) => {
    var extendedEvent: ExtendedKeyboardEvent = event as ExtendedKeyboardEvent;
    extendedEvent.displayKey = getDisplayKey(extendedEvent);
    return extendedEvent;
  });

const keyUpEventProducer = new KeyboardEventProducer('keyup',
  (event: KeyboardEvent) => {
    var extendedEvent: ExtendedKeyboardEvent = event as ExtendedKeyboardEvent;
    extendedEvent.displayKey = getDisplayKey(extendedEvent);
    return extendedEvent;
  });

const keyPressEventProducer = new KeyboardEventProducer('keypress',
  (event: KeyboardEvent) => {
    var extendedEvent: ExtendedKeyboardEvent = event as ExtendedKeyboardEvent;
    extendedEvent.displayKey = getDisplayKey(extendedEvent);
    extendedEvent.displayChar = getDisplayChar(extendedEvent);
    return extendedEvent;
  });

export class KeyboardSource {
  downs: (key?: number|string) => Stream<ExtendedKeyboardEvent>;
  ups: (key?: number|string) => Stream<ExtendedKeyboardEvent>;
  presses: (key?: number|string) => Stream<ExtendedKeyboardEvent>;
  shift$: Stream<boolean>;
  capsLock$: Stream<boolean>;
  constructor() {
    const _this = this;
    const xs = Stream;
    const keyDown$ = xs.create(keyDownEventProducer);
    this.downs = function(key?: number|string) {
        if(key === undefined)
            return keyDown$;
        if (typeof key === 'number')
            return keyDown$.filter(ev => ev.keyCode === key);
        if(typeof key === 'string')
            return keyDown$.filter(ev => ev.displayKey === key);
    };
    const keyUp$ = xs.create(keyUpEventProducer);
    this.ups = function(key?: number|string) {
        if(key === undefined)
            return keyUp$;
        if (typeof key === 'number')
            return keyUp$.filter(ev => ev.keyCode === key);
        if(typeof key === 'string')
            return keyUp$.filter(ev => ev.displayKey === key);
    };
    const keyPress$ = xs.create(keyPressEventProducer);
    this.presses = function(key?: number|string) {
        if(key === undefined)
            return keyPress$;
        if (typeof key === 'number')
            return keyPress$.filter(ev => ev.keyCode === key);
        if(typeof key === 'string')
            return keyPress$.filter(ev => ev.displayChar === key);
    };
    const shiftProducer = new KeyboardStatusProducer(
      xs.merge(
        _this.downs(16)
          .map(e => true),
        _this.ups(16)
          .map(e => false)
      ).startWith(null));
    var capsLock: boolean = null;
    const capsLockProducer = new KeyboardStatusProducer(
      xs.merge(
        _this.downs(20)
          .filter(() => capsLock != null)
          .map(e => {
            capsLock = !capsLock;
            return capsLock;
          }),
        _this.presses()
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
    this.shift$ = xs.create(shiftProducer);
    this.capsLock$ = xs.create(capsLockProducer);
  }
}

export function makeKeyboardDriver() {
  function keyboardDriver() {
    return new KeyboardSource();
  }
  return keyboardDriver;
}

export default makeKeyboardDriver;
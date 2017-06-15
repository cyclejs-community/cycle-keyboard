import { Stream } from 'xstream';
import { getDisplayKey, getDisplayChar, ExtendedKeyboardEvent } from './utils';
import { KeyboardEventProducer, KeyboardStatusProducer } from './producers';
import { adapt } from '@cycle/run/lib/adapt';


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
            return adapt(keyDown$);
        if (typeof key === 'number')
            return adapt(keyDown$.filter(ev => ev.keyCode === key));
        if(typeof key === 'string')
            return adapt(keyDown$.filter(ev => ev.displayKey === key));
    };
    const keyUp$ = xs.create(keyUpEventProducer);
    this.ups = function(key?: number|string) {
        if(key === undefined)
            return adapt(keyUp$);
        if (typeof key === 'number')
            return adapt(keyUp$.filter(ev => ev.keyCode === key));
        if(typeof key === 'string')
            return adapt(keyUp$.filter(ev => ev.displayKey === key));
    };
    const keyPress$ = xs.create(keyPressEventProducer);
    this.presses = function(key?: number|string) {
        if(key === undefined)
            return adapt(keyPress$);
        if (typeof key === 'number')
            return adapt(keyPress$.filter(ev => ev.keyCode === key));
        if(typeof key === 'string')
            return adapt(keyPress$.filter(ev => ev.displayChar === key));
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
    this.shift$ = adapt(xs.create(shiftProducer));
    this.capsLock$ = adapt(xs.create(capsLockProducer));
  }
}

export function makeKeyboardDriver() {
  function keyboardDriver() {
    return new KeyboardSource();
  }
  return keyboardDriver;
}

export default makeKeyboardDriver;
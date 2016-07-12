import { Stream } from 'xstream';
import { getDisplayKey, getDisplayChar, IExtendedKeyboardEvent } from './utils';
import { KeyboardEventProducer, KeyboardStatusProducer } from './producers';


const keyDownEventProducer = new KeyboardEventProducer('keydown',
  (event: KeyboardEvent) => {
    var extendedEvent: IExtendedKeyboardEvent = event as IExtendedKeyboardEvent;
    extendedEvent.displayKey = getDisplayKey(extendedEvent);
    return extendedEvent;
  });

const keyUpEventProducer = new KeyboardEventProducer('keyup',
  (event: KeyboardEvent) => {
    var extendedEvent: IExtendedKeyboardEvent = event as IExtendedKeyboardEvent;
    extendedEvent.displayKey = getDisplayKey(extendedEvent);
    return extendedEvent;
  });

const keyPressEventProducer = new KeyboardEventProducer('keypress',
  (event: KeyboardEvent) => {
    var extendedEvent: IExtendedKeyboardEvent = event as IExtendedKeyboardEvent;
    extendedEvent.displayKey = getDisplayKey(extendedEvent);
    extendedEvent.displayChar = getDisplayChar(extendedEvent);
    return extendedEvent;
  });

export class KeyboardDriver {
  keyDown$: Stream<IExtendedKeyboardEvent>;
  keyUp$: Stream<IExtendedKeyboardEvent>;
  keyPress$: Stream<IExtendedKeyboardEvent>;
  shift$: Stream<boolean>;
  capsLock$: Stream<boolean>;
  constructor() {
    const _this = this;
    const xs = Stream;
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
    var capsLock: boolean = null;
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

export function makeKeyboardDriver() {

  function keyboardDriver() {
    return new KeyboardDriver();
  }
  return keyboardDriver;
}
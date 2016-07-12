import { StreamListener } from './listeners';
import { Stream, Producer, Listener } from 'xstream';
import { IExtendedKeyboardEvent } from './utils';

export interface IKeyboardDriverProducer<T> {
  stream: Listener<T>
}

export class KeyboardEventProducer implements Producer<IExtendedKeyboardEvent>, IKeyboardDriverProducer<IExtendedKeyboardEvent> {
  start: (listener: Listener<IExtendedKeyboardEvent>) => void;
  stop: () => void;
  stream: Listener<IExtendedKeyboardEvent>;
  handler: (ev: IExtendedKeyboardEvent) => void;
  constructor(type: string, mapper: (ev: KeyboardEvent) => IExtendedKeyboardEvent) {
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

export class KeyboardStatusProducer implements Producer<boolean>, IKeyboardDriverProducer<boolean> {
  start: (listener: Listener<boolean>) => void;
  stop: () => void;
  stream: Listener<boolean>;
  source$: Stream<boolean>;
  streamListener: Listener<boolean>;
  constructor(stream: Stream<boolean>) {
    const _this = this;
    this.stream = null;
    this.source$ = stream;
    this.streamListener = new StreamListener(_this);
    this.start = function (listener: Listener<boolean>) {
      _this.stream = listener;
      _this.source$.addListener(_this.streamListener);
    };
    this.stop = () => _this.source$.removeListener(_this.streamListener);
  }
}
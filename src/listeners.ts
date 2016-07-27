import { KeyboardDriverProducer } from './producers';
import { Listener } from 'xstream';

export class StreamListener<T> implements Listener<T> {
  next: (x: T) => void;
  error: (err: any) => void;
  complete: () => void;
  constructor(producer: KeyboardDriverProducer<T>) {
    this.next = ev => producer.stream.next(ev);
    this.error = err => console.error(err);
    this.complete = () => { };
  }
}
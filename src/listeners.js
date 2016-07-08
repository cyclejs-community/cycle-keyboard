class StreamListener {
  constructor(producer) {
    this.next = ev => producer.stream.next(ev);
    this.error = err => console.error(err);
    this.complete = () => { };
  }
}

module.exports = { StreamListener };
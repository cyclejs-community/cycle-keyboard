class KeyboardEventProducer {
  constructor(type, mapper) {
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

module.exports = { KeyboardEventProducer, KeyboardStatusProducer };
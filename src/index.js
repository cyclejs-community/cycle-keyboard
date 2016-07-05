import xs from 'xstream';

function makeKeyboardDriver() {
  const keyDown$ = xs.create();
  const keyUp$ = xs.create();
  const keyPress$ = xs.create();
  document.addEventListener('keydown', event => keyDown$.shamefullySendNext(event));
  document.addEventListener('keyup', event => keyUp$.shamefullySendNext(event));
  document.addEventListener('keypress', event => keyPress$.shamefullySendNext(event));
  const keyboardDriver = {
    down$: keyDown$,
    up$: keyUp$,
    press$: keyPress$
  };
  return keyboardDriver;
}

module.exports = { makeKeyboardDriver };
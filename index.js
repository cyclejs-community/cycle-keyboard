import xs from 'xstream';

function makeKeyboardDriver() {
  const keyDown$ = xs.create();
  const keyUp$ = xs.create();
  const keyPress$ = xs.create();
  document.addEventListener('keydown', event => event$.shamefullySendNext(event));
  document.addEventListener('keyup', event => event$.shamefullySendNext(event));
  document.addEventListener('keypress', event => event$.shamefullySendNext(event));
  const keyboardDriver = {
    down$: keyDown$,
    up$: keyUp$,
    press$: keyPress$
  };
  return keyboardDriver;
}
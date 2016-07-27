import keycode from 'keycode';

export function getDisplayKey(ev: KeyboardEvent) {
  var key = '';
  if (ev.ctrlKey)
    key += 'ctrl';
  if (ev.shiftKey)
    key += key ? '+shift' : 'shift';
  if (ev.altKey)
    key += key ? '+alt' : 'alt';
  var keyChar = ev.type == 'keypress'
    ? getDisplayChar(ev)
    : keycode(ev.keyCode) as string;
  if (ev.type == 'keydown'
    && (keyChar == 'ctrl' || keyChar == 'alt' || keyChar == 'shift'))
    return key;
  if (key) key += '+';
  key += keyChar;
  return key;
}

export function getDisplayChar(ev: KeyboardEvent) {
  if (ev.which == null) {
    return String.fromCharCode(ev.keyCode); // IE
  } else if (ev.which != 0 && ev.charCode != 0) {
    return String.fromCharCode(ev.which);   // the rest
  } else {
    return null; // special key
  }
}

export interface ExtendedKeyboardEvent extends KeyboardEvent {
  displayKey: string;
  displayChar: string;
}
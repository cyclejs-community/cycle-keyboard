import { keyCodes } from './keycodes';

function getDisplayKey(ev) {
  var key = '';
  if (ev.ctrlKey)
    key += 'ctrl';
  if (ev.shiftKey)
    key += key ? '+shift' : 'shift';
  if (ev.altKey)
    key += key ? '+alt' : 'alt';
  var keyChar = ev.type == 'keypress'
    ? getDisplayChar(ev)
    : keyCodes[ev.keyCode];
  if (ev.type == 'keydown'
    && (keyChar == 'ctrl' || keyChar == 'alt' || keyChar == 'shift'))
    return key;
  if (key) key += '+';
  key += keyChar;
  return key;
}

function getDisplayChar(ev) {
  if (event.which == null) {
    return String.fromCharCode(event.keyCode); // IE
  } else if (event.which != 0 && event.charCode != 0) {
    return String.fromCharCode(event.which);   // the rest
  } else {
    return null; // special key
  }
}

module.exports = { getDisplayKey, getDisplayChar };
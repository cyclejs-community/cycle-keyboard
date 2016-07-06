import { keyCodes } from './keycodes';

function getDisplayKey(ev) {
  if (ev.type === 'keypress')
    return String.fromCharCode(ev.keyCode || ev.charCode);
  var key = '';
  if (ev.ctrlKey)
    key += 'ctrl';
  if (ev.shiftKey)
    key += key ? '+shift' : 'shift';
  if (ev.altKey)
    key += key ? '+alt' : 'alt';
  var keyChar = keyCodes[ev.keyCode];
  if (ev.type == 'keydown'
    && (keyChar == 'ctrl' || keyChar == 'alt' || keyChar == 'shift'))
    return key;
  if (key) key += '+';
  key += keyChar;
  return key;
}

module.exports = { getDisplayKey }
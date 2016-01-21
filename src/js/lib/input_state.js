var keyboard = require('./input_state/keyboard.js');
var gamepad = require('./input_state/gamepad.js');

InputState  = function() {
  this.debug = true; // Set to true for some debug out in console

  gamepadButtonMappings = {
    'up': 12,
    'down': 13,
    'left': 14,
    'right': 15,
    'action': 0,
    'menu': 9
  }

  keyboardButtonMappings = {
    'up': "W",
    'down': "S",
    'left': "A",
    'right': "D",
    'action': 'space',
    'menu': 'enter'
  }
}

InputState.prototype.pressed = function(button_id) {
  return keyboard.pressed(keyboardButtonMappings[button_id]) ||
         gamepad.pressed(gamepadButtonMappings[button_id])

}

// X => 0
// Circle => 1
// Square => 2
// Triangle => 3
//
module.exports = new InputState;
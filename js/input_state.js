var keyboard = new THREEx.KeyboardState();
var gamepad = new THREEx.GamepadState();

/** @namespace */
var THREEx  = THREEx    || {};

THREEx.InputState  = function() {
  this.debug = true; // Set to true for some debug out in console

  gamepadButtonMappings = {
    'up': 12,
    'down': 13,
    'left': 14,
    'right': 15
  }

  keyboardButtonmappings = {
    'up': "W",
    'down': "S",
    'left': "A",
    'right': "D"
  }
}

THREEx.InputState.prototype.pressed = function(button_id) {
  return keyboard.pressed(keyboardButtonmappings[button_id])
}

// X => 0
// Circle => 1
// Square => 2
// Triangle => 3
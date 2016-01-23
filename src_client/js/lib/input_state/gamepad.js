var log4js = require('log4js');
var logger = log4js.getLogger('[GamepadState]');

GamepadState  = function() {
  this.controllers = {};
  this.debug = true; // Set to true for some debug out in console

  // Feature detection
  // Find out if the browser exposes gamepad events

  var haveEvents = 'GamepadEvent' in window;

  if (haveEvents) {
    logger.debug('using events to detect new gamepads');
    window.addEventListener("gamepadconnected", this.connectHandler.bind(this));
    window.addEventListener("gamepaddisconnected", this.disconnectHandler.bind(this));
  } else {
    logger.debug('scanning for gamepads every 500ms');
    setInterval(this.scanGamepads.bind(this), 500);
  }
}

GamepadState.prototype.disconnectHandler = function(e) {
  logger.debug('gamepaddisconnected event received');
  this.removeGamepad(e.gamepad);
}

GamepadState.prototype.removeGamepad = function(gamepad) {
  logger.debug('removing gamepad at index: ', gamepad.index);
  delete this.controllers[gamepad.index];
}

GamepadState.prototype.connectHandler = function(e) {
  logger.debug('gamepadconnected event received');
  this.addGamepad(e.gamepad);
}

GamepadState.prototype.addGamepad = function(gamepad) {
  logger.debug('gamepad connected at index: ', gamepad.index);
  logger.debug(gamepad.id);
  this.controllers[gamepad.index] = gamepad;
}

GamepadState.prototype.scanGamepads = function() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in this.controllers)) {
        this.addGamepad(gamepads[i]);
      } else {
        this.controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

GamepadState.prototype.pressed = function(button_id) {
  this.scanGamepads();
  var gp = this.controllers[0];
  if (gp) {
    return this._buttonPressed(gp.buttons[button_id])
  }
}

GamepadState.prototype._buttonPressed = function(b) {
  if (typeof(b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}

module.exports = new GamepadState;
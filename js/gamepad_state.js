/** @namespace */
var THREEx  = THREEx    || {};

THREEx.GamepadState  = function() {
  this.controllers = {};
  this.debug = true; // Set to true for some debug out in console

  // Feature detection
  // Find out if the browser exposes gamepad events

  var haveEvents = 'GamepadEvent' in window;

  if (haveEvents) {
    this.log('using events to detect new gamepads');
    window.addEventListener("gamepadconnected", this.connectHandler.bind(this));
    window.addEventListener("gamepaddisconnected", this.disconnectHandler.bind(this));
  } else {
    this.log('scanning for gamepads every 500ms');
    setInterval(this.scanGamepads.bind(this), 500);
  }
}

THREEx.GamepadState.prototype.log = function(msg) {
  var args = Array.prototype.slice.call(arguments);
  if (this.debug) {
    console.log("[GamepadState]", args.join(" "));
  }
}

THREEx.GamepadState.prototype.disconnectHandler = function(e) {
  this.log('gamepaddisconnected event received');
  this.removeGamepad(e.gamepad);
}

THREEx.GamepadState.prototype.removeGamepad = function(gamepad) {
  this.log('removing gamepad at index: ', gamepad.index);
  delete this.controllers[gamepad.index];
}

THREEx.GamepadState.prototype.connectHandler = function(e) {
  this.log('gamepadconnected event received');
  this.addGamepad(e.gamepad);
}

THREEx.GamepadState.prototype.addGamepad = function(gamepad) {
  this.log('gamepad connected at index: ', gamepad.index);
  this.log(gamepad.id);
  this.controllers[gamepad.index] = gamepad;
}

THREEx.GamepadState.prototype.scanGamepads = function() {
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

THREEx.GamepadState.prototype.pressed = function(button_id) {
  this.scanGamepads();
  var gp = this.controllers[0];
  if (gp) {
    return this._buttonPressed(gp.buttons[button_id])
  }
}

THREEx.GamepadState.prototype._buttonPressed = function(b) {
  if (typeof(b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}

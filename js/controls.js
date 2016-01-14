window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});

var downEvent = new Event('downKey');
var upEvent = new Event('upKey');
var leftEvent = new Event('leftKey');
var rightEvent = new Event('rightKey');

window.addEventListener("keypress", function(event) {
  var a_key = 97;
  var w_key = 119;
  var d_key = 100;
  var s_key = 115;

  var A_key = 65;
  var S_key = 83;
  var D_key = 68;
  var W_key = 87;

  if (event.keyCode === a_key || event.keyCode === A_key) {
    window.dispatchEvent(leftEvent);
  };

  if (event.keyCode === w_key || event.keyCode === W_key) {
    window.dispatchEvent(upEvent);
  };

  if (event.keyCode === d_key || event.keyCode === D_key) {
    window.dispatchEvent(rightEvent);
  };

  if (event.keyCode === s_key || event.keyCode === S_key) {
    window.dispatchEvent(downEvent);
  };

  // console.log('keypress: ', event.keyCode);
});
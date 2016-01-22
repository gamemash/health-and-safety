window.WebSocket = window.WebSocket || window.MozWebSocket;

// if browser doesn't support WebSocket, just show some notification and exit
if (!window.WebSocket) {
  console.log("You dont support WebSockets, so we don't support you.");
}

var connection = new WebSocket('ws://127.0.0.1:1337');

connection.onopen = function () {
  console.log("open");
};

connection.onerror = function (error) {
  console.log("error:", error);
};

connection.onmessage = function (message) {
  console.log("message: ", message.data);
};

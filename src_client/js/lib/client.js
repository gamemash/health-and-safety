var logger = require('./logger.js');

window.WebSocket = window.WebSocket || window.MozWebSocket;

// if browser doesn't support WebSocket, just show some notification and exit
if (!window.WebSocket) {
  logger.fatal("You dont support WebSockets, so we don't support you.");
}

function Client(){
  this.connection;
  this.players = [];


  this.connect = function(){
    this.connection = new WebSocket('ws://127.0.0.1:5000');
    this.connection.onmessage = this.onmessage.bind(this);
    this.connection.onopen = this.onopen.bind(this);
    this.connection.onerror = this.onerror.bind(this);
  }

  this.onopen = function () {
    logger.debug("Websocket opened");
  }

  this.onerror = function (error) {
    logger.error("Websocket error", error);
  }

  this.sendPositionUpdate = function (x, y){
    this.connection.send(JSON.stringify({type: "positionUpdate", data: {'id': this.id, 'x': x, 'y': y }}));
  }

  this.onmessage = function (message) {
    logger.debug("message", message.data)
    var parsedData = JSON.parse(message.data);

    switch(parsedData["type"]){
      case "welcome":
        this.onwelcome(parsedData["data"]);
        break;
      case "playerList":
        this.updatePlayerList(parsedData["data"]);
        break;
      case "playerLeft":
        this.playerLeft(parsedData.data.id)
        break;
      default:
        logger.warn("unhandled message: ", JSON.parse(message.data));
        break;
    }
  }

}

module.exports = new Client;

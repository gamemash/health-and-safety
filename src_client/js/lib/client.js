window.WebSocket = window.WebSocket || window.MozWebSocket;

// if browser doesn't support WebSocket, just show some notification and exit
if (!window.WebSocket) {
  console.log("You dont support WebSockets, so we don't support you.");
}

function Client(){
  this.connection;
  this.players = [];


  this.connect = function(){
    this.connection = new WebSocket('ws://calm-gorge-77884.herokuapp.com');
    this.connection.onmessage = this.onmessage.bind(this);
  }

  this.onopen = function () {
    console.log("open");
  }

  this.onerror = function (error) {
    console.log("error:", error);
  }

  this.sendPositionUpdate = function (x, y){
    this.connection.send(JSON.stringify({type: "positionUpdate", data: {'id': this.id, 'x': x, 'y': y }}));
  }

  this.onmessage = function (message) {
    var parsedData = JSON.parse(message.data);
    console.log(this);

    switch(parsedData["type"]){
      case "welcome":
        this.onwelcome(parsedData["data"]);
        break;
      case "playerList":
        this.updatePlayerList(parsedData["data"]);
        break;
      default:
        console.log("unhandled message: ", JSON.parse(message.data));
        break;
    }
  }

}

module.exports = new Client;

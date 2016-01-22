"use strict";

process.title = 'health-and-safety-world-server';

var webSocketsServerPort = 1337;

var webSocketServer = require('websocket').server;
var http = require('http');
var clients = [];
var players = [];

var server = http.createServer(function(request, response) {
});

server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

var wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  var player = new Player(makeid(), connection)
  var index = players.push(player) - 1;
  player.connection.sendUTF(JSON.stringify( { type: "welcome", data: player.id } ));

  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
  console.log((new Date()) + ' Connection accepted. Player ID: ' + player.id);

  for (var i=0; i < players.length; i++) {
    players[i].connection.sendUTF(JSON.stringify( { type: "playerList", data: players.map(function(x){ return { "id": x.id, "x": x.x, "y": x.y} }) } ));
  }

  connection.on('message', function(message) {
    var parsedData = JSON.parse(message.utf8Data);
    console.log(parsedData);

    var player;

    for (var i=0; i < players.length; i++) {
      if (players[i].connection === connection) {
        player = players[i];
        break;
      }
    }

    switch(parsedData["type"]){
      case "positionUpdate":
        player.x = parsedData.data.x;
        player.y = parsedData.data.y;
        break;
    }
    //  case "playerList":
    //    this.updatePlayerList(parsedData["data"]);
    //    break;
    //  default:
    //    console.log("unhandled message: ", JSON.parse(message.data));
    //    break;
  });

  connection.on('close', function() {
    console.log((new Date()) + " Player " + player.id + " disconnected.");

    // Remove player from array of players
    for (var i=0; i < players.length; i++) {
      if (players[i].connection === connection) {
        players.splice(i, 1);
        return;
      }
    }
  });
});

function Player(id, connection) {
  this.id = id;
  this.connection = connection;
  this.x = 0;
  this.y = 0;
}

function makeid(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

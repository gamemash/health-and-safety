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

  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
  console.log((new Date()) + ' Connection accepted. Player ID: ' + player.id);

  for (var i=0; i < players.length; i++) {
    players[i].connection.sendUTF(JSON.stringify( { type: "playerList", data: players.map(function(x){ return x.id }) } ));
  }

  connection.on('message', function(message) {
    console.log((new Date()) + ' Received Message from ' + userName + ': ' + message.utf8Data);
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
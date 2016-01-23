"use strict";

commands = require("./commands.js")

process.title = 'health-and-safety-world-server';

var webSocketsServerPort = (process.env.PORT || 5000);

var webSocketServer = require('websocket').server;
var http = require('http');
var clients = [];
var players = [];

var server = http.createServer(function(request, response) {
  response.end('Health and Safety Websocket server');
});

server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

var wsServer = new webSocketServer({
  httpServer: server
});

// A new connection
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

  var player = registerNewPlayer(connection);
  broadcastPlayerList();

  connection.on('message', function(message) {
    handleMessage(message, connection);
  });

  connection.on('close', function() {
    deregisterPlayer(connection);
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

function registerNewPlayer(connection) {
  var player = new Player(makeid(), connection)
  var index = players.push(player) - 1;

  console.log((new Date()) + ' Player registered. Player ID: ' + player.id);

  player.connection.sendUTF(JSON.stringify( { type: "welcome", data: player.id } ));
  return player;
}

function broadcastPlayerList(){
  for (var i=0; i < players.length; i++) {
    players[i].connection.sendUTF(JSON.stringify( { type: "playerList", data: players.map(function(x){ return { "id": x.id, "x": x.x, "y": x.y} }) } ));
  }
}

function handleMessage(message, connection) {
  var parsedData = JSON.parse(message.utf8Data);
  console.log("message: ", parsedData);

  var player;

  for (var i=0; i < players.length; i++) {
    if (players[i].connection === connection) {
      player = players[i];
      break;
    }
  }

  if (!player) {
    console.log("Couldn't find a player for this connection")
    return;
  }

  if (commands[parsedData["type"]]) {
    commands[parsedData["type"]](player, parsedData);
  } else {
    console.log("Unknown command received: ", commands[parsedData["type"]])
  };
}

function deregisterPlayer(connection) {
  // Remove player from array of players
  for (var i=0; i < players.length; i++) {
    if (players[i].connection === connection) {
      console.log((new Date()) + " Player " + players[i].id + " disconnected.");
      players.splice(i, 1);
      return;
    }
  }
}
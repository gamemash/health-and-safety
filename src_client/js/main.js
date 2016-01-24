var logger = require('./lib/logger.js');

logger.info("Hi from main.js");

var Game = require('./lib/game.js');
var Client = require('./lib/client.js');
var NetworkInput = require('./lib/network_input.js');

window.Game = new Game;
window.Game.connectToServer = function(){
  Client.connect();
}

Client.onwelcome = function(id){
  Client.id = id;
  window.Game.localPlayer.id = id;
}

Client.updatePlayerList = function(playerList){
  console.log(Client.players)
  for (index in playerList){
    var newPlayer = playerList[index];

    if (newPlayer.id == Client.id)
      continue;

    if (Client.players.indexOf(newPlayer.id) == -1){
      logger.info("A new player has arrived");
      Client.players.push(newPlayer.id);
      var player = window.Game.addPlayer(new NetworkInput());
      player.id = newPlayer.id;
      player.position.x = newPlayer.x;
      player.position.y = newPlayer.y;
    } else {
      for (var i=0; i < window.Game.players.length; i++) {
        if (window.Game.players[i].id === newPlayer.id) {
          window.Game.players[i].position.x = newPlayer.x;
          window.Game.players[i].position.y = newPlayer.y;
          break;
        }
      }
    }
  }
}

Client.playerLeft = function(player_id) {
  logger.info("A player has left: " + player_id);
  window.Game.removePlayer(player_id);
}

setInterval(function() {
  var position = window.Game.localPlayer.position;
  Client.sendPositionUpdate(position.x, position.y);
}, 10)




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
}

Client.updatePlayerList = function(playerList){
  for (index in playerList){
    var newPlayerId = playerList[index].id;

    if (newPlayerId == Client.id)
      continue;
    if (Client.players.indexOf(newPlayerId) == -1){
      logger.info("A new player has arrived");
      Client.players.push(newPlayerId);
      var newPlayer = window.Game.addPlayer(new NetworkInput());
    }
  }
}

setInterval(function() {
  var position = window.Game.localPlayer.position;
  Client.sendPositionUpdate(position.x, position.y);
}, 3000)




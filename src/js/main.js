var log4js = require('log4js');
var logger = log4js.getLogger('[Main]');

log4js.configure({
  appenders: [
    {
      type: 'console',
      layout: {
        type: 'basic'
      }
    }
  ]
});

// logger.setLevel('OFF');

logger.info("Hi from main.js");

var Game = require('./lib/game.js');
var Client = require('./lib/client.js');

window.Game = new Game;
window.Game.connectToServer = function(){
  Client.connect();
}

Client.onwelcome = function(id){
  Client.id = id;
  console.log("my id is", id);
  //window.Game.addPlayer();
}

Client.updatePlayerList = function(playerList){
  for (index in playerList){
    var newPlayerId = playerList[index];

    if (newPlayerId == Client.id)
      continue;
    if (Client.players.indexOf(newPlayerId) == -1){
      console.log("A new player has arrived");
      Client.players.push(newPlayerId);
      window.Game.addPlayer();
    }
  }
}



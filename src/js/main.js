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

logger.info("Hi from main.js");

var Game = require('./lib/game.js');

window.Game = new Game;
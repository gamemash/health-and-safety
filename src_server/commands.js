var positionUpdate = function(player, parsedData) {
  player.x = parsedData.data.x;
  player.y = parsedData.data.y;
};

commands = {
  "positionUpdate": positionUpdate
}

module.exports = commands;
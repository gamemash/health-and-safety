var THREE = require('../../vendor/three.min.js');

function AnimatedTexture(texture, textureMap, movingDirectionRowMap, standingDirectionRowMap){
  this.directionMap = [1, -1, 1, 1];

  this.textureMap = textureMap;

  this.movingDirectionRowMap = movingDirectionRowMap;
  this.standingDirectionRowMap = standingDirectionRowMap;

  this.currentRow = 0;
  this.currentColumn = 0;

  this.numberOfColumns = Math.max.apply(null, textureMap);
  this.numberOfRows = textureMap.length;
  console.log(this.numberOfColumns, this.numberOfRows);

  texture.repeat.set(texture.PowerOf2Factor.x / this.numberOfColumns, texture.PowerOf2Factor.y / this.numberOfRows);
  texture.offset.y = this.currentRow * texture.PowerOf2Factor.y / this.numberOfRows;
  texture.wrapS =  texture.wrapT = THREE.RepeatWrapping;
  this.timeSinceAnimation = 0.0;
  this.direction = 1;

  this.update = function(dt){
    //texture.repeat.x = Math.abs(texture.repeat.x) * this.direction;
    this.timeSinceAnimation += dt;

    if (this.direction == -1){
      texture.repeat.x = -texture.PowerOf2Factor.x / this.numberOfColumns;
      texture.offset.x = (this.currentColumn + 1) * texture.PowerOf2Factor.x / this.numberOfColumns;
    } else {
      texture.repeat.x = texture.PowerOf2Factor.x / this.numberOfColumns;
      texture.offset.x = this.currentColumn * texture.PowerOf2Factor.x / this.numberOfColumns;
    }

    if (this.timeSinceAnimation > 0.1){
      this.timeSinceAnimation = 0.0;
      this.currentColumn = (this.currentColumn + this.direction + this.textureMap[this.currentRow]) % this.textureMap[this.currentRow];
    }
  };

  this.selectRow = function(direction, moving){
    var oldRow = this.currentRow;
    this.direction = this.directionMap[direction];
    if (moving){
      this.currentRow = this.movingDirectionRowMap[direction];
    } else {
      this.currentRow = this.standingDirectionRowMap[direction];
    }

    if (oldRow != this.currentRow){
      this.currentColumn = this.currentColumn % this.textureMap[this.currentRow];
      texture.offset.x = this.currentColumn  * texture.PowerOf2Factor.x / this.numberOfColumns;
      texture.offset.y = this.currentRow * texture.PowerOf2Factor.y / this.numberOfRows;
    }
  };
}

module.exports = AnimatedTexture;

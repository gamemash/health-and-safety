var THREE = require('../../vendor/three.min.js');
var Chunk = require('./chunk.js')

function World(){
    this.group = new THREE.Group();
    this.entities = [];

    this.loadChunks = function(){
      //var chunk1 = new Chunk();
      //chunk1.setPosition(-1, -1);
      //this.group.add(chunk1.mesh);

      var chunk2 = new Chunk();
      chunk2.setPosition(0, 0);
      this.group.add(chunk2.mesh);

      //var chunk3 = new Chunk();
      //chunk3.setPosition(0, -1);
      //this.group.add(chunk3.mesh);

      //var chunk4 = new Chunk();
      //chunk4.setPosition(-1, 0);
      //this.group.add(chunk4.mesh);
    }

    this.addEntity = function(entity){
      this.entities[this.entities.length] = entity;
    }
}

module.exports = World;
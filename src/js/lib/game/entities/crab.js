var ImageLoader = require('../image_loader.js');
var THREE = require('../../../vendor/three.min.js');
var rectShape = require('../rect_shape.js');
var AnimatedTexture = require('../animated_texture.js');
var Player    = require('../player.js')

///WIP
function Crab() {
  this.speed = 0.01;
  this.currentDirection = 0;
  this.moving = true;
  this.update = function(dt, entities){
    for(index in entities){
      if (entities[index].genus == 'human'){
        var entity = entities[index];
        
        var direction = new THREE.Vector2(entity.position.x, entity.position.y);
        direction.x -= this.position.x;
        direction.y -= this.position.y;
        direction.normalize();
        if (direction.x < -0.7)
          this.currentDirection = 1;
        if (direction.x > 0.7)
          this.currentDirection = 3;
        if (direction.y < -0.7)
          this.currentDirection = 2;
        if (direction.y > 0.7)
          this.currentDirection = 0;
       
        console.log(this.currentDirection);
        this.position.x += direction.x * this.speed;
        this.position.y += direction.y * this.speed;
        break;
      }
      //if (entities[index] instanceof Player)
    }

    this.animatedTexture.selectRow(this.currentDirection, this.moving);
    this.animatedTexture.update(dt);
  }

  var texture = ImageLoader.createSprite("crab.png", 256, 320, 0, 0);
  var material = new THREE.MeshBasicMaterial( {
    map: texture,
    transparent: true
  } );

  var rectGeom = new THREE.ShapeGeometry(rectShape );
  this.mesh = new THREE.Mesh( rectGeom, material ) ;
  this.position = this.mesh.position;
  this.position.z = 10;

  var textureMap = [7, 6, 8, 6, 4, 8, 4, 6, 7, 8];
  var movingDirectionRowMap = [3, 7, 3, 7];
  var standingDirectionRowMap = [4, 6, 0, 6];
  this.animatedTexture = new AnimatedTexture(texture, textureMap, movingDirectionRowMap, standingDirectionRowMap);

  this.cameraGravity = 20;
  this.getCameraGravity = function(){
    return new THREE.Vector2(this.position.x, this.position.y);
  }

}


module.exports = Crab;

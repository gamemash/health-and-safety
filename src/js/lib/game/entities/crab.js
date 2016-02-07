var ImageLoader = require('../image_loader.js');
var THREE = require('../../../vendor/three.min.js');
var rectShape = require('../rect_shape.js');
var AnimatedTexture = require('../animated_texture.js');

///WIP
function Crab() {
  this.update = function(dt){
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

  this.cameraGravity = 1;
  this.getCameraGravity = function(){

    return this.position;
  }

}


module.exports = Crab;

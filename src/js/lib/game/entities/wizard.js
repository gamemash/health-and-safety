var ImageLoader = require('../image_loader.js');
var THREE = require('../../../vendor/three.min.js');
var rectShape = require('../rect_shape.js');
var AnimatedTexture = require('../animated_texture.js');

function Wizard() {
  this.update = function(dt){

    this.animatedTexture.selectRow(this.currentDirection, this.moving);
    this.animatedTexture.update(dt);
  }

  var texture = ImageLoader.createSprite("wizard.png", 468, 780, 0, 0);
  var material = new THREE.MeshBasicMaterial( {
    map: texture,
    transparent: true
  } );

  var rectGeom = new THREE.ShapeGeometry(rectShape );
  this.mesh = new THREE.Mesh( rectGeom, material ) ;
  this.position = this.mesh.position;
  this.position.z = 10;

  var textureMap = [6, 6, 6, 4, 4, 4, 4, 4, 4, 4];
  var movingDirectionRowMap = [4, 5, 3, 5];
  var standingDirectionRowMap = [1, 2, 0, 2];
  this.animatedTexture = new AnimatedTexture(texture, textureMap, movingDirectionRowMap, standingDirectionRowMap);


  this.cameraGravity = 1;
  this.getCameraGravity = function(){

    return this.position;
  }

}


module.exports = Wizard;

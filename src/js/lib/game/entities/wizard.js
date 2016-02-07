var ImageLoader = require('../image_loader.js');
var THREE = require('../../../vendor/three.min.js');
var rectShape = require('../rect_shape.js');
var AnimatedTexture = require('../animated_texture.js');

function Wizard() {
  this.update = function(dt){

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

  this.animatedTexture = new AnimatedTexture(texture);

  this.cameraGravity = 1;
  this.getCameraGravity = function(){

    return this.position;
  }

}


module.exports = Wizard;

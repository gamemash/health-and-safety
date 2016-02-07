var ImageLoader = require('../image_loader.js');
var THREE = require('../../../vendor/three.min.js');
var rectShape = require('../rect_shape.js');

///WIP
function Crab() {
  this.update = function(dt){

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


  this.cameraGravity = 1;
  this.getCameraGravity = function(){

    return this.position;
  }

}


module.exports = Crab;

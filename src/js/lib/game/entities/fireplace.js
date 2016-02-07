var ImageLoader = require('../image_loader.js');
var THREE = require('../../../vendor/three.min.js');
var rectShape = require('../rect_shape.js');

function Fireplace() {
  var texture = ImageLoader.createSprite("tilesheet.png", 42, 57, 243, 3);
  var material = new THREE.MeshBasicMaterial( {
    map: texture,
    transparent: true
  } );

  var rectGeom = new THREE.ShapeGeometry(rectShape );
  this.mesh = new THREE.Mesh( rectGeom, material ) ;
  this.position = this.mesh.position;
  this.position.z = 10;

  this.cameraGravity = 2;
  this.getCameraGravity = function(){
    return this.mesh.position;
  }

  this.update = function(){

  }
}

module.exports = Fireplace;
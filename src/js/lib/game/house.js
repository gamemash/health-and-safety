var ImageLoader = require('./image_loader.js');
var THREE = require('../../vendor/three.min.js');
var rectShape = require('./rect_shape.js');

function House(x, y){
  if(!House.texture)
    House.texture = ImageLoader.createSprite("tilesheet.png", 324, 366, 183, 96);

  var material = new THREE.MeshBasicMaterial( {
    map: House.texture,
    transparent: true
  } );

  var rectGeom = new THREE.ShapeGeometry(rectShape );
  this.mesh = new THREE.Mesh( rectGeom, material ) ;
  this.mesh.scale.x = 5;
  this.mesh.scale.y = 5;
  this.position = this.mesh.position;
  this.position.x = x;
  this.position.y = y;
  this.position.z = 1;


  this.cameraGravity = 2;
  this.getCameraGravity = function(){
    return new THREE.Vector2((this.mesh.position.x + 2.5) * this.cameraGravity, (this.mesh.position.y + 2.5) * this.cameraGravity);
  }

  this.update = function(){

  }
}

module.exports = House;
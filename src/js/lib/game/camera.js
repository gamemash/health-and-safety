var THREE = require('../../vendor/three.min.js');

function Camera(){
  this.maxCameraSpeed = 20.0;

  var ratio = window.innerWidth / window.innerHeight;
  var width = 32;
  var height = width / ratio;
  this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, - 50, 1000 );

  this.update = function(newCenterOfGravity, dt){
    var distance = newCenterOfGravity.distanceTo(this.camera.position);
    var factor = (1.0 - Math.exp(-distance / this.maxCameraSpeed)) * this.maxCameraSpeed;

    var difference = newCenterOfGravity.sub(this.camera.position);
    var velocity = difference.normalize().multiplyScalar(factor);
    if (velocity.length() > 0.22){
      this.camera.position.x += velocity.x * dt;
      this.camera.position.y += velocity.y * dt;
    }
  };
}

module.exports = Camera;
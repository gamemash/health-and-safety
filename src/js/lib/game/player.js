var ImageLoader = require('./image_loader.js');
var THREE = require('../../vendor/three.min.js');
var Wizard = require('./entities/wizard.js');
var Crab = require('./entities/crab.js');

function Player(input){
  this.currentDirection = 2; //"WASD" = 0123
  this.moving = false;
  this.speed = 2.0;

  this.genus = 'human';
  this.character = new Wizard();
  this.mesh = this.character.mesh;
  this.position = this.mesh.position;
  this.position.z = 1;

  this.update = function(dt){
    this.moving = false;

    if (!this.mesh)
      return;

    if (input.pressed('down')) {
      this.moving = true;
      this.currentDirection = 2;
      this.mesh.position.y -= this.speed * dt;
    }

    if (input.pressed('left')) {
      this.moving = true;
      this.currentDirection = 1;
      this.mesh.position.x -= this.speed * dt;
    }

    if (input.pressed('right')) {
      this.moving = true;
      this.currentDirection = 3;
      this.mesh.position.x += this.speed * dt;
    }

    if (input.pressed('up')) {
      this.moving = true;
      this.currentDirection = 0;
      this.mesh.position.y += this.speed * dt;
    }

    if (input.pressed('action')) {
      // action
    }

    if (input.pressed('menu')) {
      // menu
    }

    this.character.currentDirection = this.currentDirection;
    this.character.moving = this.moving;
    this.character.update(dt);


  }

  this.cameraGravity = 20;
  this.getCameraGravity = function(){
    var velocity = new THREE.Vector2(0, 0);
    switch (this.currentDirection) { //future ronald, think of a better solution for this.
      case 0:
        velocity.y += 1;
        break;
      case 1:
        velocity.x -= 1;
        break;
      case 2:
        velocity.y -= 1;
        break;
      case 3:
        velocity.x += 1;
        break;
    }

    velocity.multiplyScalar(this.speed * 3);

    velocity.add(this.mesh.position);
    return new THREE.Vector2(velocity.x * this.cameraGravity, velocity.y * this.cameraGravity);
  }
}

module.exports = Player;

var log4js = require('log4js');
var logger = log4js.getLogger('[Game]');
var World = require('./game/world.js');
var ImageLoader = require('./game/image_loader.js')

var THREE = require('../vendor/three.min.js');
var input = require('./input_state.js');

var scene = new THREE.Scene();
var width = window.innerWidth;
var height = window.innerHeight;
var renderer = new THREE.WebGLRenderer({alpha: true});
var camera;
var rectShape;


var currentDirection = 0;
var speed = 10.0;
var player;
var centerOfGravityCamera;
var cameraLocationTest;
var world = new World();
var viewCorrectionDistance = 10;
//var tileSheet = new TileSheet("tilesheet.png");

var images = ["tilesheet.png", "wizard.png", "house.png"];
var imageLoader;

var shaders = ["world.frag", "world.vert"];
var ShaderLoader = require('./game/shader_loader.js');
var gameLoader;



function init() {
  gameLoader = new GameLoader();
  gameLoader.start();
}

function GameLoader(){
  this.start = function(){
    this.loadImages();
  }

  this.loadImages = function(){
    logger.debug("Loading images");
    ImageLoader.load(images, this);
  }

  this.loadedImages = function(){
    logger.debug("Done");
    this.loadShaders();
  }

  this.loadShaders = function(){
    logger.debug("Loading shaders");
    ShaderLoader.import(shaders, this);
  }

  this.loadedShaders = function(){
    logger.debug("Done, initializing game");
    initGame();
  }
}

function initGame() {
  var gameCanvas = document.getElementById('game-canvas');
  renderer.setSize( window.innerWidth, window.innerHeight );
  gameCanvas.appendChild( renderer.domElement );


  var rectWidth = 1;
  var rectLength = 1;
  rectShape = new THREE.Shape();
  rectShape.moveTo( 0,0 );
  rectShape.lineTo( 0, rectWidth );
  rectShape.lineTo( rectLength, rectWidth );
  rectShape.lineTo( rectLength, 0 );
  rectShape.lineTo( 0, 0 );


  var group = new THREE.Group();

  {
    player = new Player();
    group.add(player.mesh);
    world.addEntity(player);
  }

  {
    var newHouse = new House(-2, 1);
    group.add(newHouse.mesh);
    world.addEntity(newHouse);
  }

  {
    var newHouse = new House(12, 1);
    group.add(newHouse.mesh);
    world.addEntity(newHouse);
  }

  {
    world.loadChunks();
    group.add(world.group);
  }


  camera = new Camera();
  {
    var texture = ImageLoader.createSprite("tilesheet.png", 42, 57, 243, 3);
    var material = new THREE.MeshBasicMaterial( {
      map: texture,
      transparent: true
    } );

    var rectGeom = new THREE.ShapeGeometry(rectShape );
    cameraLocationTest = new THREE.Mesh( rectGeom, material ) ;
    group.add(cameraLocationTest);
  }


  scene.add( group );

  render();

}

// cube.position.z = 3;

function render() {
  var dt = 1.0 / 60.0;

  if (player)
    player.update(dt);

  var sumIntensity = 0.0;
  var cameraPosition = new THREE.Vector2(0, 0);

  for(index in world.entities){
    var entity = world.entities[index];
    if (entity.mesh.position.distanceTo(player.mesh.position) > viewCorrectionDistance)
      continue;
    cameraPosition.add(entity.getCameraGravity());
    sumIntensity += entity.cameraGravity;
  }

  cameraPosition.divideScalar(sumIntensity);

  if (cameraLocationTest){ //show the desired camera center in the world
    cameraLocationTest.position.setX(cameraPosition.x);
    cameraLocationTest.position.setY(cameraPosition.y);
  }

  if (camera)
    camera.update(cameraPosition, dt);

  requestAnimationFrame( render );
  renderer.render( scene, camera.camera );
}

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
}

function Player(){
  this.currentDirection = 2; //"WASD" = 0123
  this.moving = false;
  this.speed = 2.0;

  if (!Player.texture){
    Player.texture = ImageLoader.createSprite("wizard.png", 468, 780, 0, 0);
  }
  var rectGeom = new THREE.ShapeGeometry( rectShape );
  this.material = new THREE.MeshBasicMaterial( {
    map: Player.texture,
    transparent: true
  } );
  this.animatedTexture = new AnimatedTexture(Player.texture);
  this.mesh = new THREE.Mesh( rectGeom, this.material );
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

    if (this.animatedTexture){
      this.animatedTexture.selectRow(this.currentDirection, this.moving);
      this.animatedTexture.update(dt);
    }

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

function AnimatedTexture(texture){
  this.textureMap = [6, 6, 6, 4, 4, 4, 4, 4, 4, 4];
  this.movingDirectionRowMap = [4, 5, 3, 5];
  this.directionMap = [1, -1, 1, 1];
  this.standingDirectionRowMap = [1, 2, 0, 2];

  this.currentRow = 0;
  this.currentColumn = 0;
  this.numberOfColumns = 6;
  this.numberOfRows = 10;
  texture.repeat.set(texture.PowerOf2Factor.x / this.numberOfColumns, texture.PowerOf2Factor.y / this.numberOfRows);
  texture.offset.y = this.currentRow * texture.PowerOf2Factor.y / this.numberOfRows;
  texture.wrapS =  texture.wrapT = THREE.RepeatWrapping;
  this.timeSinceAnimation = 0.0;
  this.direction = 1;

  this.update = function(dt){
    //texture.repeat.x = Math.abs(texture.repeat.x) * this.direction;
    this.timeSinceAnimation += dt;

    if (this.direction == -1){
      texture.repeat.x = -texture.PowerOf2Factor.x / this.numberOfColumns;
      texture.offset.x = (this.currentColumn + 1) * texture.PowerOf2Factor.x / this.numberOfColumns;
    } else {
      texture.repeat.x = texture.PowerOf2Factor.x / this.numberOfColumns;
      texture.offset.x = this.currentColumn * texture.PowerOf2Factor.x / this.numberOfColumns;
    }

    if (this.timeSinceAnimation > 0.1){
      this.timeSinceAnimation = 0.0;
      this.currentColumn = (this.currentColumn + this.direction + this.textureMap[this.currentRow]) % this.textureMap[this.currentRow];
    }
  };

  this.selectRow = function(direction, moving){
    var oldRow = this.currentRow;
    this.direction = this.directionMap[direction];
    if (moving){
      this.currentRow = this.movingDirectionRowMap[direction];
    } else {
      this.currentRow = this.standingDirectionRowMap[direction];
    }

    if (oldRow != this.currentRow){
      this.currentColumn = this.currentColumn % this.textureMap[this.currentRow];
      texture.offset.x = this.currentColumn  * texture.PowerOf2Factor.x / this.numberOfColumns;
      texture.offset.y = this.currentRow * texture.PowerOf2Factor.y / this.numberOfRows;
    }
  };
}


function Camera(){
  this.maxCameraSpeed = 20.0;
  // this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
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

module.exports = init;

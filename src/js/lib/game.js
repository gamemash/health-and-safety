var log4js = require('log4js');
var logger = log4js.getLogger('[Game]');

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
var shaderLoader;
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
    imageLoader = new ImageLoader(images);
  }

  this.loadedImages = function(){
    logger.debug("Done");
    this.loadShaders();
  }

  this.loadShaders = function(){
    logger.debug("Loading shaders");
    shaderLoader = new ShaderLoader(shaders);
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
    var texture = imageLoader.createSprite("tilesheet.png", 42, 57, 243, 3);
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

function World(){
    this.group = new THREE.Group();
    this.entities = [];

    this.loadChunks = function(){
      var chunk1 = new Chunk();
      chunk1.setPosition(-1, -1);
      this.group.add(chunk1.mesh);

      var chunk2 = new Chunk();
      chunk2.setPosition(0, 0);
      this.group.add(chunk2.mesh);

      var chunk3 = new Chunk();
      chunk3.setPosition(0, -1);
      this.group.add(chunk3.mesh);

      var chunk4 = new Chunk();
      chunk4.setPosition(-1, 0);
      this.group.add(chunk4.mesh);
      console.log(this.group);
    }

    this.addEntity = function(entity){
      this.entities[this.entities.length] = entity;
    }
}

function Chunk(){
  if (!Chunk.setup){
    Chunk.setup = {};
    Chunk.setup.uniforms = {
        texture1: { type: "t", value: imageLoader.createSprite("tilesheet.png", 960, 4704, 0, 0) },
        chunkData: { type: "iv1", value: (new Int32Array(256)) }
    };

    Chunk.setup.geometry = new THREE.BufferGeometry();
    Chunk.setup.material = new THREE.ShaderMaterial( {
      uniforms: Chunk.setup.uniforms,
      vertexShader: shaderLoader.get("world.vert"),
      fragmentShader: shaderLoader.get("world.frag")
    } );

    Chunk.setup.chunkSize = 16;

    var vertexPositions = [
      [ 0.0,  0.0, -1.0],
      [ 1.0,  0.0, -1.0],
      [ 1.0,  1.0, -1.0],

      [ 1.0,  1.0, -1.0],
      [ 0.0,  1.0, -1.0],
      [ 0.0,  0.0, -1.0]
    ];
    var vertices = new Float32Array( vertexPositions.length * 3 ); // three components per vertex

    for ( var i = 0; i < vertexPositions.length; i++ )
    {
      vertices[ i*3 + 0 ] = vertexPositions[i][0] * Chunk.setup.chunkSize;
      vertices[ i*3 + 1 ] = vertexPositions[i][1] * Chunk.setup.chunkSize;
      vertices[ i*3 + 2 ] = vertexPositions[i][2] * Chunk.setup.chunkSize;
    }

    Chunk.setup.geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    Chunk.setup.geometry.computeBoundingBox();
  }

  this.scale = 2;
  this.mesh = new THREE.Mesh( Chunk.setup.geometry, Chunk.setup.material ) ;
  this.mesh.scale.x = this.scale;
  this.mesh.scale.y = this.scale;

  this.setPosition = function(x, y){
    var pos = new THREE.Vector2(x,y);
    this.chunkPosition = pos.clone();
    pos.multiplyScalar(this.scale * Chunk.setup.chunkSize);
    this.mesh.position.x = pos.x;
    this.mesh.position.y = pos.y;
  }
}

function House(x, y){
  if(!House.texture)
    House.texture = imageLoader.createSprite("tilesheet.png", 324, 366, 183, 96);

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
    Player.texture = imageLoader.createSprite("wizard.png", 468, 780, 0, 0);
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

    velocity.multiplyScalar(this.speed);
    if (this.moving)
      velocity.multiplyScalar(3);
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


function ImageLoader(imageFilenames){
  this.numberLoaded = 0;
  this.numberImages = imageFilenames.length;
  this.imageFilenames = imageFilenames;
  this.folder = "images/";
  this.images = {};

  for(index in this.imageFilenames){
    var filename = this.imageFilenames[index];
    var path = this.folder + filename;


    var image = new Image();
    image.src = path;
    image.onload = (function(imageLoader, index){
      return function(){
        imageLoader.loaded(index);
      }
    })(this, index);

    this.images[filename] = {
      'filename': filename,
      'loaded': false,
      'image': image
    }
  }

  this.loaded = function(index){
    this.numberLoaded++;
    if (this.numberLoaded == this.numberImages){
      gameLoader.loadedImages();
    }
    var filename = this.imageFilenames[index];
    this.images[filename].loaded = true;
  }

  this.image = function(filename){
    return this.images[filename].image;
  }

  this.createSprite = function (filename, width, height, offset_x, offset_y){
    var image = this.image(filename);
    var canvas = document.createElement('canvas');
    var nWidth = ImageLoader.NextPowerOf2(width),
       nHeight = ImageLoader.NextPowerOf2(height);
    canvas.setAttribute('width', nWidth);
    canvas.setAttribute('height', nHeight);
    var ctx = canvas.getContext('2d');
    var dataTexture, data;

    ctx.drawImage(image, offset_x, offset_y, width, height, 0, nHeight - height, width, height);
    data = ctx.getImageData(0, 0, nWidth, nHeight);

    dataTexture = new THREE.DataTexture(new Uint8Array(data.data.buffer), nWidth, nHeight, THREE.RGBAFormat);
    dataTexture.PowerOf2Factor = new THREE.Vector2(width / nWidth, height / nHeight);
    dataTexture.flipY = true;
    dataTexture.repeat.set(width / nWidth, height / nHeight);
    dataTexture.wrapS = dataTexture.wrapT = THREE.RepeatWrapping;
    dataTexture.needsUpdate = true;

    return dataTexture;
  }

  ImageLoader.NextPowerOf2 = function(value){
    var n = 0;
    while ((1 << n) < value) n++;
    return 1 << n;
  }
}

function ShaderLoader(shadersList){
  this.shadersList = shadersList;
  this.n = 0;
  this.shaders = {};

  this.load = function(filename){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = (function(shaderLoader) {
      return function(){
        if (xhttp.readyState == 4 && xhttp.status == 200)
          shaderLoader.save(filename, xhttp.responseText);
      }
    })(this);
    xhttp.open("GET", "shaders/" + filename, true);
    xhttp.send();
  }

  for(index in shadersList){
    this.load(shadersList[index]);
  }


  this.save = function(filename, content){
    this.shaders[filename] = content;
    this.n++;

    if (this.n == shadersList.length)
      gameLoader.loadedShaders();
      //console.log("loaded all shaders");
  }

  this.get = function(filename){
    return this.shaders[filename];
  }

}


module.exports = init;

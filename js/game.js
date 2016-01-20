var keyboard = new THREEx.KeyboardState();
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
var world = [];
var viewCorrectionDistance = 10;
//var tileSheet = new TileSheet("tilesheet.png");

var images = ["tilesheet.png", "wizard.png", "house.png"];
var imageLoader;



function init() {
  imageLoader = new ImageLoader(images);
}

function initGame() {
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );


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
    world[world.length] = player;
  }

  {
    var newHouse = new House(-2, 1);
    group.add(newHouse.mesh);
    world[world.length] = newHouse;
  }

  {
    var newHouse = new House(12, 1);
    group.add(newHouse.mesh);
    world[world.length] = newHouse;
  }


  camera = new Camera();
  {
    var texture = imageLoader.createSprite("tilesheet.png", 42, 57, 243, 3);
    var material = new THREE.MeshBasicMaterial( {
      map: texture
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

  for(index in world){
    if (world[index].mesh.position.distanceTo(player.mesh.position) > viewCorrectionDistance)
      continue;
    cameraPosition.add(world[index].getCameraGravity());
    sumIntensity += world[index].cameraGravity;
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
    House.texture = imageLoader.createSprite("tilesheet.png", 330, 372, 170, 100);

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
    if (!this.mesh)
      return;

    if (keyboard.pressed("W")){
      this.moving = true;
      this.currentDirection = 0;
      this.mesh.position.y += this.speed * dt;
    } else if (keyboard.pressed("A")){
      this.moving = true;
      this.currentDirection = 1;
      this.mesh.position.x -= this.speed * dt;
    } else if (keyboard.pressed("S")){
      this.moving = true;
      this.currentDirection = 2;
      this.mesh.position.y -= this.speed * dt;
    } else if (keyboard.pressed("D")){
      this.moving = true;
      this.currentDirection = 3;
      this.mesh.position.x += this.speed * dt;
    } else {
      this.moving = false;
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
  texture.repeat.set(1.0 / this.numberOfColumns, 1.0 / this.numberOfRows);
  texture.offset.y = this.currentRow / this.numberOfRows;
  texture.wrapS =  texture.wrapT = THREE.RepeatWrapping;
  this.timeSinceAnimation = 0.0;
  this.direction = 1;

  this.update = function(dt){
    //texture.repeat.x = Math.abs(texture.repeat.x) * this.direction;
    this.timeSinceAnimation += dt;

    if (this.direction == -1){
      texture.repeat.x = -1.0 / this.numberOfColumns;
      texture.offset.x = (this.currentColumn + 1) / this.numberOfColumns;
    } else {
      texture.repeat.x = 1.0 / this.numberOfColumns;
      texture.offset.x = this.currentColumn / this.numberOfColumns;
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
      texture.offset.x = this.currentColumn / this.numberOfColumns;
      texture.offset.y = this.currentRow / this.numberOfRows;
    }
  };
}


function Camera(){
  this.maxCameraSpeed = 20.0;
  this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  this.camera.position.z = 10;

  this.update = function(newCenterOfGravity, dt){
    var distance = newCenterOfGravity.distanceTo(this.camera.position);
    var factor = (1.0 - Math.exp(-distance / this.maxCameraSpeed)) * this.maxCameraSpeed;

    var difference = newCenterOfGravity.sub(this.camera.position);
    var velocity = difference.normalize().multiplyScalar(factor);
    this.camera.position.x += velocity.x * dt;
    this.camera.position.y += velocity.y * dt;
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
      initGame();
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
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    var ctx = canvas.getContext('2d');
    var dataTexture, data;

    ctx.drawImage(image, offset_x, offset_y, width, height, 0, 0, width, height);
    data = ctx.getImageData(0, 0, width, height);

    dataTexture = new THREE.DataTexture(new Uint8Array(data.data.buffer), width, height, THREE.RGBAFormat);
    dataTexture.flipY = true;
    dataTexture.needsUpdate = true;
    dataTexture.wrapS = dataTexture.wrapT = THREE.ClampToEdgeWrapping;
    return dataTexture;
  }

}

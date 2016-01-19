var keyboard = new THREEx.KeyboardState();
var scene = new THREE.Scene();
var width = window.innerWidth;
var height = window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({alpha: true});


var currentDirection = 0;
var speed = 10.0;
var player = new Player();
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
  var rectShape = new THREE.Shape();
  rectShape.moveTo( 0,0 );
  rectShape.lineTo( 0, rectWidth );
  rectShape.lineTo( rectLength, rectWidth );
  rectShape.lineTo( rectLength, 0 );
  rectShape.lineTo( 0, 0 );
  


  var group = new THREE.Group();

  var loader = new THREE.TextureLoader();

  {

    var texture = imageLoader.createSprite("wizard.png", 468, 780, 0, 0);
    var material = new THREE.MeshBasicMaterial( {
      map: texture
    } );
    player.animatedTexture = new AnimatedTexture(texture);

    var rectGeom = new THREE.ShapeGeometry( rectShape );
    player.mesh = new THREE.Mesh( rectGeom, material ) ;
    player.mesh.scale.x = 1;
    player.mesh.scale.y = 1;
    player.mesh.position.z = 1;

    group.add(player.mesh);
    world[world.length] = player;

  }

  {
    var texture = imageLoader.createSprite("tilesheet.png", 330, 372, 170, 100);


    var material = new THREE.MeshBasicMaterial( {
      map: texture
    } );

    var rectGeom = new THREE.ShapeGeometry(rectShape );
    var mesh = new THREE.Mesh( rectGeom, material ) ;
    var newHouse = new House(texture, mesh, 10, -1);
    group.add(newHouse.mesh);
    world[world.length] = newHouse;
  }

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

  camera.position.z = 10;
  centerOfGravityCamera = new CenterOfGravityCamera(camera);

  

  render();

}

// cube.position.z = 3;

function render() {
  var dt = 1.0 / 60.0;

  if (player)
    player.update(dt);

  var sumIntensity = 0.0;
  for(index in world){
    if (world[index].mesh.position.distanceTo(player.mesh.position) > viewCorrectionDistance)
      continue;

    sumIntensity += world[index].cameraGravity;
  }

  var cameraPosition = new THREE.Vector2(0, 0);

  for(index in world){
    if (world[index].mesh.position.distanceTo(player.mesh.position) > viewCorrectionDistance)
      continue;
    cameraPosition.x += (world[index].mesh.position.x * world[index].cameraGravity) / sumIntensity;
    cameraPosition.y += (world[index].mesh.position.y * world[index].cameraGravity) / sumIntensity;
  }

  if (cameraLocationTest){
    cameraLocationTest.position.x = cameraPosition.x;
    cameraLocationTest.position.y = cameraPosition.y;
  }

  if (centerOfGravityCamera)
    centerOfGravityCamera.update(cameraPosition, dt);
  

  //camera.position.x = cameraPosition.x;
  //camera.position.y = cameraPosition.y;


  requestAnimationFrame( render );
  renderer.render( scene, camera );
}

function Player(){
  this.currentDirection = 2; //"WASD" = 0123
  this.moving = false;
  this.animatedTexture;
  this.mesh;
  this.speed = 2.0;
  this.cameraGravity = 10;

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

function CenterOfGravityCamera(camera){
  this.maxCameraSpeed = 5.0;
  this.time = 0;

  this.update = function(newCenterOfGravity, dt){
    this.time += dt;
    var distance = newCenterOfGravity.distanceTo(camera.position);
    var factor = (1.0 - Math.exp(-distance / this.maxCameraSpeed)) * this.maxCameraSpeed;

    var difference = newCenterOfGravity.sub(camera.position);
    var velocity = difference.normalize().multiplyScalar(factor);
    camera.position.x += velocity.x * dt;
    camera.position.y += velocity.y * dt;


  };

}


function House(texture, mesh, x, y){
  this.mesh = mesh;
  this.mesh.scale.x = 5;
  this.mesh.scale.y = 5;
  this.mesh.position.x = x;
  this.mesh.position.y = y;
  this.cameraGravity = 3;
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

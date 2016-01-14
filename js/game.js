var keyboard = new THREEx.KeyboardState();
var scene = new THREE.Scene();
var width = window.innerWidth;
var height = window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

var currentDirection = 0;
var speed = 10.0;
var player = new Player();

function init() {
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
  loader.load('images/wizard.png', function(texture){
      var material = new THREE.MeshBasicMaterial( {
        map: texture
      } );

      player.animatedTexture = new AnimatedTexture(texture);

      var rectGeom = new THREE.ShapeGeometry( rectShape );
      player.mesh = new THREE.Mesh( rectGeom, material ) ;

      group.add(player.mesh);
  });

  

  scene.add( group );

  camera.position.z = 10;

  render();
}

// cube.position.z = 3;

function render() {
  var dt = 1.0 / 60.0;

  if (player)
    player.update(dt);

  requestAnimationFrame( render );
  renderer.render( scene, camera );
}

function Player(){
  this.currentDirection = 2; //"WASD" = 0123
  this.moving = false;
  this.animatedTexture;
  this.mesh;
  this.speed = 2.0;

  this.update = function(dt){

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
    texture.repeat.x = Math.abs(texture.repeat.x) * this.direction;
    this.timeSinceAnimation += dt;
    if (this.timeSinceAnimation > 0.1){
      this.timeSinceAnimation = 0.0;
      this.currentColumn = (this.currentColumn + this.direction + this.textureMap[this.currentRow]) % this.textureMap[this.currentRow];
      if (this.direction == 1)
        texture.offset.x = this.currentColumn / this.numberOfColumns;
      else{
        texture.offset.x = this.currentColumn / this.numberOfColumns + 1;
        //console.log(texture.offset.x);
      }
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
      texture.offset.y = this.currentRow / this.numberOfRows;
    }
  };
}

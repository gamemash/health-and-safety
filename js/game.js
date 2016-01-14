var keyboard = new THREEx.KeyboardState();
var scene = new THREE.Scene();
var width = window.innerWidth;
var height = window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

var currentDirection = 0;
var speed = 10.0;
var rectMesh;

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
  loader.load('images/house.png', function(texture){
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      var material = new THREE.MeshBasicMaterial( {
        map: texture
      } );

      var rectGeom = new THREE.ShapeGeometry( rectShape );
      rectMesh = new THREE.Mesh( rectGeom, material ) ;

      group.add( rectMesh);
  });

  

  scene.add( group );

  camera.position.z = 10;

  render();
}

// cube.position.z = 3;

function render() {
  var dt = 1.0 / 60.0;
  if (keyboard.pressed("A")) {
    rectMesh.position.x -= speed * dt;
    console.log('left');
  }

  if (keyboard.pressed("S")) {
    rectMesh.position.y -= speed * dt;
    console.log('down');
  }

  if (keyboard.pressed("D")) {
    rectMesh.position.x += speed * dt;
    console.log('right');
  }

  if (keyboard.pressed("W")) {
    rectMesh.position.y += speed * dt;
    console.log('up');
  }

  requestAnimationFrame( render );
  renderer.render( scene, camera );
}

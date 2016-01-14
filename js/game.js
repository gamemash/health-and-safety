var keyboard = new THREEx.KeyboardState();
var scene = new THREE.Scene();
var width = window.innerWidth;
var height = window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

function init() {
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0x444444 } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 10;

  render();
}

// cube.position.z = 3;

function render() {
  if (keyboard.pressed("A")) {
    console.log('left');
  }

  if (keyboard.pressed("S")) {
    console.log('down');
  }

  if (keyboard.pressed("D")) {
    console.log('right');
  }

  if (keyboard.pressed("W")) {
    console.log('up');
  }

  requestAnimationFrame( render );
  renderer.render( scene, camera );
}
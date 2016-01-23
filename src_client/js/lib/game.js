var logger = require('./logger.js');

var THREE = require('../vendor/three.min.js');
var rectShape = require('./game/rect_shape.js');

var ImageLoader = require('./game/image_loader.js');
var ShaderLoader = require('./game/shader_loader.js');

var Camera = require('./game/camera.js');
var World = require('./game/world.js');
var House = require('./game/house.js');
var Player = require('./game/player.js')
var LocalInput = require('./input_state.js');

var images = ["tilesheet.png", "wizard.png", "house.png"];
var shaders = ["world.frag", "world.vert"];

function Game() {
  var cameraLocationTest;
  var camera;
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer({alpha: true});
  var world = new World();
  var viewCorrectionDistance = 10;
  var group = new THREE.Group();
  this.players = [];
  this.localPlayer;

  this.init = function() {
    var gameLoader = new GameLoader();
    gameLoader.startLoading(this);
  }

  this.initGame = function() {
    var gameCanvas = document.getElementById('game-canvas');
    renderer.setSize( window.innerWidth, window.innerHeight );
    gameCanvas.appendChild( renderer.domElement );

    this.localPlayer = this.addPlayer(new LocalInput());

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

    this.render();
  }

  this.addPlayer = function(input){
    var player = new Player(input);
    group.add(player.mesh);
    world.addEntity(player);
    this.players.push(player);
    return player;
  }

  this.render = function() {
    var dt = 1.0 / 60.0;

    for(index in this.players)
      this.players[index].update(dt);

    var sumIntensity = 0.0;
    var cameraPosition = new THREE.Vector2(0, 0);

    for(index in world.entities){
      var entity = world.entities[index];
      if (entity.mesh.position.distanceTo(this.localPlayer.mesh.position) > viewCorrectionDistance)
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

    requestAnimationFrame( this.render.bind(this) );
    renderer.render( scene, camera.camera );
  }
}

function GameLoader(){
  this.startLoading = function(game){
    this.loadImages();
    this.game = game;
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
    this.game.initGame();
    this.game.connectToServer();
  }
}

module.exports = Game;

var log4js = require('log4js');
var logger = log4js.getLogger('[Game]');

var THREE = require('../vendor/three.min.js');
var rectShape = require('./game/rect_shape.js');

var ImageLoader = require('./game/image_loader.js');
var ShaderLoader = require('./game/shader_loader.js');

var Camera = require('./game/camera.js');
var World = require('./game/world.js');
var House = require('./game/house.js');
var Player = require('./game/player.js')
var Fireplace = require('./game/entities/fireplace.js')
var input = require('./input_state.js');

var images = ["tilesheet.png", "wizard.png", "house.png"];
var shaders = ["world.frag", "world.vert"];

function Game() {
  var cameraLocationTest;
  var camera;

  var renderer = new THREE.WebGLRenderer({alpha: true});
  var player;
  var world = new World();
  var viewCorrectionDistance = 10;

  this.init = function() {
    var gameLoader = new GameLoader();
    gameLoader.startLoading(this);
  }

  this.initGame = function() {
    var gameCanvas = document.getElementById('game-canvas');
    renderer.setSize( window.innerWidth, window.innerHeight );
    gameCanvas.appendChild( renderer.domElement );

    this.player = new Player(input);
    this.fireplace = new Fireplace();
    world.addEntity(this.player);

    world.addEntity(new House(-2, 1));

    world.addEntity(new House(12, 1));


    world.addEntity(this.fireplace);

    world.loadChunks();

    this.camera = new Camera();

    world.scene.add( world.group );

    this.render();
  }

  this.render = function() {
    var dt = 1.0 / 60.0;

    var sumIntensity = 0.0;
    var cameraPosition = new THREE.Vector2(0, 0);

    for(index in world.entities){
      var entity = world.entities[index];

      entity.update(dt);

      if (entity.mesh.position.distanceTo(this.player.mesh.position) > viewCorrectionDistance)
        continue;

      cameraPosition.add(entity.getCameraGravity());
      sumIntensity += entity.cameraGravity;
    }

    cameraPosition.divideScalar(sumIntensity);

    if (this.fireplace){ //show the desired camera center in the world
      this.fireplace.position.setX(cameraPosition.x);
      this.fireplace.position.setY(cameraPosition.y);
    }

    if (this.camera)
      this.camera.update(cameraPosition, dt);

    requestAnimationFrame( this.render.bind(this) );
    renderer.render( world.scene, this.camera.camera );
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
  }
}

module.exports = Game;

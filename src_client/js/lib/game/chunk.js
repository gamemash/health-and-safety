var ImageLoader = require('./image_loader.js');
var ShaderLoader = require('./shader_loader.js');
var THREE = require('../../vendor/three.min.js');

function Chunk(){
  if (!Chunk.setup){

    Chunk.setup = {};
    Chunk.setup.chunkSize = 16;

    Chunk.setup.tileData = [];
    Chunk.setup.tileData[0] = [449,  494, 0, 0];
    Chunk.setup.tileData[1] = [240, 1872, 0, 0];
    Chunk.setup.tileData[2] = [864,  480, 0, 0];
    Chunk.setup.tileData[3] = [0,   1169, 0, 0];

    Chunk.setup.texture = ImageLoader.createSprite("tilesheet.png", 960, 4704, 0, 0);

    Chunk.setup.geometry = new THREE.BufferGeometry();

    var vertexPositions = [
      [ 0.0,  0.0, 0.0],
      [ 1.0,  0.0, 0.0],
      [ 1.0,  1.0, 0.0],

      [ 1.0,  1.0, 0.0],
      [ 0.0,  1.0, 0.0],
      [ 0.0,  0.0, 0.0]
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


  var numberOfTiles = Chunk.setup.chunkSize * Chunk.setup.chunkSize;

  this.chunkData = new Float32Array(numberOfTiles * 4);
  this.chunkIndices = new Uint8Array(numberOfTiles);
  for (var i = 0; i < numberOfTiles; i++){
    this.chunkIndices[i] = 1;
  }
  for(var i = 0; i < numberOfTiles; i++){
    this.chunkData[i * 4 + 0] = Chunk.setup.tileData[this.chunkIndices[i]][0];
    this.chunkData[i * 4 + 1] = Chunk.setup.tileData[this.chunkIndices[i]][1];
    this.chunkData[i * 4 + 2] = Chunk.setup.tileData[0][0];
    this.chunkData[i * 4 + 3] = Chunk.setup.tileData[0][1];
    //this.chunkData[i * 4 + 2] = 0.0;
    //this.chunkData[i * 4 + 3] = 0.0;
  }
  this.dataTexture = new THREE.DataTexture(this.chunkData, Chunk.setup.chunkSize, Chunk.setup.chunkSize, THREE.RGBAFormat, THREE.FloatType);
  this.dataTexture.needsUpdate = true;

  this.uniforms = {
      texture1: { type: "t", value: Chunk.setup.texture },
      chunkData: { type: "t", value: this.dataTexture }
  };

  this.material = new THREE.ShaderMaterial( {
    uniforms: this.uniforms,
    vertexShader: ShaderLoader.get("world.vert"),
    fragmentShader: ShaderLoader.get("world.frag"),
    transparent: true
  } );

  //Chunk.setup.material.needsUpdate = true;

  this.scale = 1.5;
  this.mesh = new THREE.Mesh( Chunk.setup.geometry, this.material ) ;
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

module.exports = Chunk;
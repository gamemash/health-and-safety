var THREE = require('../../vendor/three.min.js');

function ImageLoader(){

  this.load = function(imageFilenames, listener) {
    this.numberLoaded = 0;
    this.numberImages = imageFilenames.length;
    this.imageFilenames = imageFilenames;
    this.folder = "images/";
    this.listener = listener;
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

  }

  this.loaded = function(index){
    this.numberLoaded++;
    if (this.numberLoaded == this.numberImages){
      this.listener.loadedImages();
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

module.exports = new ImageLoader;
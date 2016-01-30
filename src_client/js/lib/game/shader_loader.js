function ShaderLoader(){
  this.import = function(shadersList, listener) {
    this.shadersList = shadersList;
    this.n = 0;
    this.shaders = {};
    this.listener = listener;

    for(index in this.shadersList){
      this.load(shadersList[index]);
    }
  }

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

  this.save = function(filename, content){
    this.shaders[filename] = content;
    this.n++;

    if (this.n == this.shadersList.length)
      this.listener.loadedShaders();
  }

  this.get = function(filename){
    return this.shaders[filename];
  }

}

module.exports = new ShaderLoader;
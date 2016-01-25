"use strict";


function RingBuffer(length) {
  this.length = length;
  this.index = 0;
  this.data = [];
  this.push = function(value){
    this.index = this.nextIndex();
    this.data[this.index] = value;
  }

  this.nextIndex = function(){
    return (this.index + 1) % length;
  }

  this.get = function(index){
    return this.data[(index + this.index + length) % length];
  }
}

function Player(){
  this.speed = 20;
  this.position = {'x': 0, 'y': 0};
  this.direction = [0, -1];
  this.moving = false;

  this.advance = function(dt){
    if (this.moving){
      this.position.x += dt * this.direction[0];
      this.position.y += dt * this.direction[1];
    }
  }
  this.apply = function(data){
    switch(data.type){
      case 'changeDirection':
        this.moving = true;
        this.direction = data.direction;
        break;
      case 'stopMoving':
        this.moving = false;
        break;
    }
  }
}

function Command(){
  this.params;
  this.timestamp;
}

function Client() {
  this.lastAppliedCommandAt = 0;
  this.commands = new RingBuffer(10);
  this.addCommand = function(timestamp, data){
    this.commands.push( { 'timestamp': timestamp, 'data': data });
  }
  this.player = new Player();

  this.getNewCommands = function(){
    var result = [];
    var i = 0;
    while(true){
      var nextCommand = this.commands.get(i);
      if (nextCommand && nextCommand['timestamp'] > this.lastAppliedCommandAt){
        result.push(nextCommand);
      } else {
        return result;
      }
      i--;
    }
    return result;
  }
}

function World() {
  this.clients = [];
  this.time = Date.now() / 1000;

  this.addClient = function(){
    var newClient = new Client();
    this.clients.push(newClient);
    return newClient;
  }

  this.advance = function(dt){
    for(var i in this.clients){
      var client = this.clients[i];
      var timeTillCommand = 0;
      var time = this.time;
      var commands = client.getNewCommands();
      var command;
      while(command = commands.pop()){
        timeTillCommand = command.timestamp - time;
        client.player.advance(timeTillCommand);
        client.player.apply(command.data);
        client.lastAppliedCommandAt = command.timestamp;
        time += timeTillCommand;
      }

      var timeTodo = dt - timeTillCommand;
      client.player.advance(timeTodo);
    }
    this.time += dt;
  }

}

//var world = new World();
//world.time = 0;
//var client = world.addClient();
//console.log(client.player.position);
//client.addCommand(1, {'type': 'changeDirection', 'direction': [1, 0]});
//client.addCommand(1.5, {'type': 'stopMoving' });
//world.advance(2);
//client.addCommand(2.5, {'type': 'changeDirection', 'direction': [0, 1]});
//world.advance(2);
//
//console.log("player at", world.time,  client.player);
//client.addCommand(3.0, {'type': 'changeDirection', 'direction': [0, -1]});
//client.addCommand(3.5, {'type': 'changeDirection', 'direction': [1, 0]});
//client.addCommand(3.9, {'type': 'stopMoving'});
//world.advance(2);
//console.log("player at", world.time, client.player);

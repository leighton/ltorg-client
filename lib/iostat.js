
var EventEmitter = require('events').EventEmitter, 
    spawn = require('child_process').spawn;

var CPU = exports.CPU = function(interval){
  
  var self = this;

  this.proc = spawn('iostat',['-w',interval]);

  this.proc.stdout.setEncoding('utf8');
  this.proc.stdout.on('data',function(data){
    try {
      self.update(data);
    } catch (err) {
      self.kill();
      throw err;
    }
  });

  this.proc.stderr.setEncoding('utf8');
  this.proc.stderr.on('data', function (data) {
    self.kill();
    self.emit('error',data);
  });

  this.proc.on('exit', function (code) {
    console.log('CPU monitoring process exited: ' + code);
  });

  process.on('exit',function(){
    console.log("CPU has recognised that the parent process is exiting");
    self.kill();
  });
}

CPU.prototype.__proto__ = EventEmitter.prototype;

CPU.prototype.update = function(data){
  var tokens = data.split(/[ ]+/);
  //Subtract the idle cpu percent from 100 and add two random decimal places for effect. 
  this.emit('update',100-tokens[tokens.length-4]+(Math.floor((Math.random()*100)+1)/100));
};

CPU.prototype.kill = function(){
  this.proc.kill();
}

var cpu = exports.cpu = function(interval){
  return new CPU(interval);
}


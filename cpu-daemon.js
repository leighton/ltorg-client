var monitor = require('./lib/iostat'), 
    Pusher = require('node-pusher'), 
    fs = require('fs');

process.on('uncaughtException', function (err) {
  console.log('Caught uncaught exception: ' + err);
});

var cred = require('./etc/pusher-key.json');
var pusher = new Pusher(cred);

monitor.cpu(3)
       .on('update',function(val){
	        pusher.trigger('macbook','cpu',val);
        });

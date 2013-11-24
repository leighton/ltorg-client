var http = require("http"),
    Hmmac = require('hmmac'),
    crypto = require('crypto'),
    Pusher = require('node-pusher');


var default_config = {
  host : "leightonturner.org",
  port : 80,
  hmmac : {
    headerPrefix:'Hmmac', 
    hash: 'sha1', 
    serviceLabel: 'HMAC' 
  },
  pusher_cred : {},
  api_cred : {}
};

var UpdateClient = exports.UpdateClient = function(config){
  var cfg = {};
  for(var m in default_config){
    config[m] ? cfg[m] = config[m] : cfg[m] = default_config[m];
  }
  this.config = cfg;
  this.hmmac = new Hmmac(this.config.hmmac);
}

UpdateClient.prototype.activity = function(msg, timeout,fn){

  var data =  JSON.stringify({
    msg : msg,
    timeout : timeout
  });

  var hmac_cred = {
    accessKeyId : this.config.api_cred.user,
    accessKeySecret : this.config.api_cred.secret
  };

  var opts = {
    host : this.config.host,
    port : this.config.port,
    path : "/activity",
    method : 'PUT',
    data : data,
    headers : {
      'Content-Type' : 'application/json',
      'Content-MD5' : crypto.createHash('md5').update(data || '').digest('hex')
    }
  };

  var signed_request = this.hmmac.signHttpRequest(hmac_cred, opts);
  //console.log(signed_request); 
  
  console.log("Attempting to update server activity cache");
  var req = http.request(signed_request,fn);
  req.write(data);
  req.end();

  var pusher = new Pusher(this.config.pusher_cred);
  console.log('Pushing message to connected clients');
  pusher.trigger('macbook','activity',{
    msg : msg,
    timeout : timeout
  });

}


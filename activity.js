var client = require('./lib/client.js');

var values = (function(){
  var args=process.argv.splice(2);
  if(args.length==0){
    console.log('Usage: ./activity.js -t <timeout> -m "<message>"');
    process.exit(1);
  }
  var arg_parser = {
    "-t" : function(val){
      var unit = val.charAt(val.length-1);
      var nval = parseInt(val.substring(0,val.length-1));
      switch(unit){
        case 's':
          return nval*1000;
        case 'm':
          return nval*1000*60;
        case 'h':
          return nval*1000*60*60;
        default:
          throw Error('Could not parse timeout! '+val);
      }
    },
    "-m" : function(val){
      return val;
    }
  };

  var vals = {
    "-t" : 0,
    "-m" : "?"
  };

  args.forEach(function(v,i){
    if(v=='-t') {
      vals[v] = arg_parser[v](args[i+1]);
    } else if (v=='-m') {
      vals[v] = arg_parser[v](args.splice(i+1).join(" "));
    } else {
      new Error("No argument for "+v);
    }
    /*This suddenly stopped working when upgrading node
    if(v.charAt(0)=='-'){
      if(arg_parser[v]!==undefined){
        if(args.length>=i+2){
          vals[v]=arg_parser[v](args[i+1]);
        }else{
          new Error('No argument for '+v);
        }
      }else{
        throw Error('Could not parse arguments '+v);
      }
    }	
    */
  });
  return vals;
}());

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

var updater = new client.UpdateClient({
  hmmac : require('./etc/hmmac-config.json'),
  pusher_cred : require('./etc/pusher-key.json'),
  api_cred : require('./etc/api-key.json')
  //,host : "localhost"
  //,port : "3000"
});


updater.activity(values['-m'],values['-t'], function(res) {
  console.log('STATUS: ' + res.statusCode);
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log(chunk);
  });
});



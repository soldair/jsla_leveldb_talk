var shoe = require('shoe')
, http = require('http')
, level = require('level')
, sublevel = require('level-sublevel')
, livestream = require('level-live-stream')
, through = require('through')
, jsonify = require('./lib/jsonify')
, persist = require('./lib/persist')
, padtime = require('./lib/padtime')

// create simple http static server
var ecstatic = require('ecstatic')(__dirname + '/static')
, server = http.createServer(ecstatic)
server.listen(9999,function(){
  console.log(this.address());
});

// create handle to database and create sublevel "tables".
var db = sublevel(level('./db',{createIfMissing:true,valueEncoding:'json'}))
, loglevel = db.sublevel('log')
, userslevel = db.sublevel('users')


// track the current connections mouse.
shoe(function (stream) { 

  // send the data to the database
  var changes = persist(stream);

  // update current state
  changes.pipe(userslevel.createWriteStream())

  // save everything in a "log"
  changes.pipe(through(function(data){
    // monitonic will make sure the keys are unique and sort by time.
    var key = padtime()+'!'+data.key
    , value = data.value

    if(!value) value = false;
    this.queue({type:"put",key:key,value:value});

  })).pipe(loglevel.createWriteStream())

}).install(server, '/mouse');


// send everyone a live feed of all mice
shoe(function (stream) { 
  
  var live = livestream(userslevel)
  live.pipe(jsonify()).pipe(stream);

}).install(server, '/mice');


shoe(function(stream){

  // transform log format to livestream format
  loglevel.createReadStream().pipe(through(function(data){
    if(!data.value) this.queue({type:'del',key:data.key.split('ÿusersÿ').pop()});
    else this.queue({type:"put",key:data.value.id,value:data.value});
  })).pipe(jsonify()).pipe(stream);

}).install(server,'/replay')



// cleanup any orphan connected users
// reads happen on snapshots so even if this took a while new connected users would not be deleted.

var logorphans = loglevel.createWriteStream();
userslevel.createReadStream().pipe(through(function(data){
  this.queue({type:'del',key:data.key});
  var log = {type:'put',key:padtime()+'!'+userslevel._key(data.key),value:false};
  logorphans.write(log);
},function(){
  this.queue(null);
  logorphans.end();
})).pipe(userslevel.createWriteStream());


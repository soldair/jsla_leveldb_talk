var main = document.getElementById('main')
, blocks = require('./client/blocks')
, mouse = require("./client/mouse")
, jsonify = require('./lib/jsonify')
, unjsonify = require('./lib/unjsonify')
, shoe = require('shoe')
, throttle = require('./client/throttle')

module.exports = function(){
  var color = require('random-color')()
  , id = Date.now()

  mouse(id,color).pipe(jsonify()).pipe(shoe('/mouse'));

  return shoe('/mice').pipe(unjsonify()).pipe(blocks(main));
}

module.exports.replay = function(cb){
  shoe('/replay').pipe(unjsonify()).pipe(throttle(150)).pipe(blocks(main)).on('close',cb);
}


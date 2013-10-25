var through = require('through')
, block = require('./block')
, moveable = require('./moveable')

// takes events for many blocks and routes them to the correct blocks.
module.exports = function(container){
  var blocks = {}

  var s = through(function(data){

    if(!blocks[data.key] && data.value) { 

      blocks[data.key] = block(data.key,data.value.c)
      blocks[data.key].stream = moveable(blocks[data.key])

      container.appendChild(blocks[data.key]); 

    } else if(!data.value){
      if(!blocks[data.key]) return;
      if(blocks[data.key].stream) blocks[data.key].stream.end();
      container.removeChild(blocks[data.key]); 
      delete blocks[data.key]
      return;
    }

    blocks[data.key].stream.write(data.value);
    this.queue([blocks[data.key],data]);
  });

  return s;
}


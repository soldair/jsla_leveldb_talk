var through = require('through')
, unjsonify = require('./unjsonify')

module.exports = function(stream){
  var id
  // create stream to unjson the input
  , parse = stream.pipe(unjsonify())
  // transform data events into leveldb write stream values.
  , insert = through(function(data){
    id = data.id;

    // if a stream is active put it in the db
    this.queue({type:'put',key:data.id,value:data});

  },function(){

    // if a stream has stopped remove it
    this.queue({type:'del',key:id});
    this.queue(null);
  });

  // there is a sock bug it seems where close fires before end which doesnt play nice with through.
  parse.on('data',function(data){
    insert.write(data);
  }).on('close',function(){
    insert.end();
  })

  return insert;
}



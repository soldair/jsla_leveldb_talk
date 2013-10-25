
var through = require('through')

module.exports = function(){
  return through(function(data){
    this.queue(JSON.stringify(data));
  })
}


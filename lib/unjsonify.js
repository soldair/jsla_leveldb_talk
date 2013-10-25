
var through = require('through')

module.exports = function(){
  return through(function(data){
    try{
      data = JSON.parse(data);
    } catch(e) {
      return  console.error('json error',data);
    }

    this.queue(data);
  },function(){
    this.queue(null)
  })
}


var through = require('through')

module.exports = function(element){
  var last; 
  var s =  through(function(data){
    if(!this.paused) this.queue(data)
    else last = data;
  },function(){
    if(last) this.queue(last)
    last = false;
    this.queue(null)
  }).on('data',function(data){
    element.style.position = 'absolute';
    element.style.left = (data.x+3)+'px';
    element.style.top = (data.y+3)+'px';
  }).on('drain',function(){
    if(last) this.queue(last);
    last = false;
  })
  return s;
}


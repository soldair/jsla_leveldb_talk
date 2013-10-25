var through = require('through')
var monotonic = require('monotonic-timestamp');

module.exports = function(id,color){
  var last;

  var s = through(function(data){
    if(!this.paused) this.queue(data)
    else last = data;
  },function(){
    if(last) this.queue(last);
    last = false;
    this.queue(null)
  });

  var fn = function(ev){
    s.write({id:id,x:ev.clientX,y:ev.clientY,c:color});
  }

  document.body.addEventListener('mousemove',fn)

  s.on('end',function(){
    document.body.removeEventListener('mousemove',fn);
    s.emit('close');
  }).on('drain',function(){
    if(last) this.queue(last);
    last = false;
  });

  return s;
}


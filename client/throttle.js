var through = require('through');

// objects per second
module.exports = function(ops){
  var buf = [];
  var s = through(function(data){
    buf.push(data);
    if(buf.length > ops*2) this.pause();
  });

  (function fn(){
    setTimeout(function(){
      if(buf.length < ops && s.paused) s.resume();
      if(buf.length) s.emit('data',buf.shift());
      fn();
    },1000/ops);
  }())
  

  return s;  
}




var monotonic = require('monotonic-timestamp');


module.exports = function(){
  var t = monotonic();
  t = (t+'').replace('.','')
  var remaining = 20-t.length
  return t+(new Array(remaining+1)).join('0')
}



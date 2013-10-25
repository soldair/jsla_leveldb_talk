var through = require('through')

module.exports = function(id,color){
  var el = document.createElement('div');

  el.style.position = 'absolute';
  el.style.width = '100px'
  el.style.height = '100px'
  el.color = el.style.backgroundColor = color
  el.textContent = id;
  return el;
}


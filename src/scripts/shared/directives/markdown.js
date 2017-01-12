'use strict';

var marked = require('marked');

module.exports = function(element, binding) {
  element.innerHTML = marked(binding.value, {
    gfm: true
  });
};

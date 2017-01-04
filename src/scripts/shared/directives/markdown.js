'use strict';

var marked = require('marked');
var Vue = require('vue');

Vue.directive('markdown', function(element, binding) {
  element.innerHTML = marked(binding.value, {
    gfm: true
  });
});

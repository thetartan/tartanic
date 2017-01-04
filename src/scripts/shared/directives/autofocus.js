'use strict';

var Vue = require('vue');

Vue.directive('autofocus', {
  inserted: function(element) {
    element.focus();
  }
});

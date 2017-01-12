'use strict';

var _ = require('lodash');
var Vue = require('vue');

_.each(require('./filters'), function(definition, name) {
  Vue.filter(name, definition);
});

_.each(require('./directives'), function(definition, name) {
  Vue.directive(name, definition);
});

_.each(require('./components'), function(definition, name) {
  Vue.component(name, definition);
});

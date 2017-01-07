'use strict';

var Vue = require('vue');
var Vuex = require('vuex');

Vue.use(Vuex);

module.exports = new Vuex.Store({
  state: require('./state'),
  getters: require('./getters'),
  mutations: require('./mutations'),
  actions: require('./actions')
});

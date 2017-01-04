'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  props: ['item'],
  methods: _.extend({}, Vuex.mapActions([
    'editTartan',
    'viewTartan',
    'downloadTartan',
    'likeTartan'
  ]))
};

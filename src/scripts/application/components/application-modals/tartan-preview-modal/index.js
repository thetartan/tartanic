'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  props: ['value', 'item', 'schema'],
  computed: {
    isVisible: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        this.$emit('input', value);
      }
    }
  },
  methods: _.extend({}, Vuex.mapActions([
    'editTartan',
    'downloadTartan',
    'likeTartan'
  ]))
};

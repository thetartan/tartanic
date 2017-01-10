'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  props: ['value', 'itemRef', 'schema'],
  computed: {
    isVisible: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        this.$emit('input', value);
      }
    },
    item: function() {
      return this.$store.getters.getStorageItem(this.itemRef);
    }
  },
  methods: _.extend({}, Vuex.mapActions([
    'editTartan',
    'downloadTartan',
    'toggleFavorites'
  ]))
};

'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  computed: _.extend({
    item: function() {
      return this.$store.getters.getStorageItem(this.state.itemRef);
    }
  }, Vuex.mapState({
    'state': 'tartanPreview'
  })),
  methods: _.extend({}, Vuex.mapActions([
    'editTartan',
    'downloadItem',
    'toggleFavorites'
  ]))
};

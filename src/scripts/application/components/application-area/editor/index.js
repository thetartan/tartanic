'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  computed: _.extend({
    state: function() {
      return this.$store.state.currentPage.state;
    }
  }, Vuex.mapGetters({
    item: 'currentItem'
  }))
};

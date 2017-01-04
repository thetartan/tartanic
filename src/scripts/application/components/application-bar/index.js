'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  computed: _.extend({}, Vuex.mapState([
    'currentPage'
  ])),
  methods: {
    toggleSidebarMenu: function() {
      this.$emit('toggle-menu');
    }
  }
};

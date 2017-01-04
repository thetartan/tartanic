'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  computed: _.extend({
    datasets: function() {
      return this.storage.datasets;
    }
  }, Vuex.mapGetters([
    'storage'
  ])),
  components: {
    listItem: require('./list-item')
  }
};

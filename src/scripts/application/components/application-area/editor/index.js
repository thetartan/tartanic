'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  computed: _.extend({
    item: function() {
      var result = null;
      var ref = this.currentPage.itemRef;
      _.each(this.storage.datasets, function(dataset) {
        result = _.find(dataset.items, {$ref: ref});
        return !result;  // continue if not found
      });
      return result;
    },
    state: function() {
      return this.currentPage.state;
    }
  }, Vuex.mapState([
    'currentPage'
  ]), Vuex.mapGetters([
    'storage'
  ]))
};

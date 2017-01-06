'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  computed: _.extend({
    dataset: function() {
      return _.find(this.storage.datasets, {
        name: this.currentPage.itemRef
      });
    },
    datasetState: function() {
      return this.$store.state.itemState[this.dataset.$ref];
    },
    pagination: function() {
      return this.currentPage.pagination;
    },
    firstDisplayItem: function() {
      var pagination = this.pagination;
      return (pagination.currentPage - 1) * pagination.itemsPerPage;
    },
    lastDisplayItem: function() {
      return this.firstDisplayItem + this.pagination.itemsPerPage;
    }
  }, Vuex.mapState([
    'currentPage'
  ]), Vuex.mapGetters([
    'storage'
  ])),
  components: {
    listItem: require('./list-item')
  }
};

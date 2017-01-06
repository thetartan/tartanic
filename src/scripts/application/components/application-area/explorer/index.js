'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  computed: _.extend({
    datasetState: function() {
      return this.$store.state.itemState[this.dataset.$ref];
    },
    pagination: function() {
      return this.page.pagination;
    },
    firstDisplayItem: function() {
      var pagination = this.pagination;
      return (pagination.currentPage - 1) * pagination.itemsPerPage;
    },
    lastDisplayItem: function() {
      return this.firstDisplayItem + this.pagination.itemsPerPage;
    }
  }, Vuex.mapState({
    page: 'currentPage'
  }), Vuex.mapGetters({
    dataset: 'currentItem'
  })),
  components: {
    listItem: require('./list-item')
  }
};

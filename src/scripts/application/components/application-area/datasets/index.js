'use strict';

var _ = require('lodash');

module.exports = {
  template: require('./template.html'),
  computed: _.extend({
    datasets: function() {
      return this.$store.getters.storage.datasets;
    }
  }),
  components: {
    listItem: require('./list-item')
  }
};

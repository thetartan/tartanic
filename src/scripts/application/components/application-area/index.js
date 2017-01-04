'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  computed: _.extend({}, Vuex.mapState([
    'currentPage'
  ])),
  watch: {
    'currentPage.viewAs': function() {
      // Scroll to top
      (window.scrollTo || window.scroll)(0, 0);
    }
  },
  components: {
    editor: require('./editor'),
    explorer: require('./explorer'),
    home: require('./home'),
    favorite: require('./favorite'),
    personal: require('./personal'),
    datasets: require('./datasets'),
    about: require('./about')
  }
};

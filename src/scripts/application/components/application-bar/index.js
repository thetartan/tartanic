'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  data: function() {
    return {
      isAdditionActionsMenuVisible: false
    };
  },
  computed: _.extend({
    additionalMenuStyle: function() {
      var itemCount = this.currentPage.additionalActions.length;
      switch (itemCount) {
        case 0: return 'none';
        case 1: return 'buttons';
        case 2: return 'buttons';
        default: return 'dropdown';
      }
    }
  }, Vuex.mapState([
    'currentPage'
  ])),
  methods: {
    toggleSidebarMenu: function() {
      this.$emit('toggle-menu');
    },
    triggerAdditionalAction: function(action) {
      this.$store.dispatch(action.action, action.argument);
    }
  }
};

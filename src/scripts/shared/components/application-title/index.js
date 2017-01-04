'use strict';

/* global document */

var $ = require('jquery');

module.exports = {
  template: '<span style="display: none !important;"><slot></slot></span>',
  methods: {
    updateApplicationTitle: function() {
      document.title = $(this.$el).text();
    }
  },
  mounted: function() {
    this.updateApplicationTitle();
  },
  updated: function() {
    this.updateApplicationTitle();
  }
};

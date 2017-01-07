'use strict';

var $ = require('jquery');

module.exports = {
  template: '<div class="ui dropdown" ref="dropdown"><slot></slot></div>',
  props: ['value'],
  watch: {
    value: function(value) {
      $(this.$refs.dropdown).dropdown(value ? 'show' : 'hide');
    }
  },
  mounted: function() {
    var that = this;
    $(that.$refs.dropdown).dropdown({
      on: 'click',
      allowReselection: true,
      allowAdditions: true,
      action: 'hide',
      forceSelection: false,
      showOnFocus: false,
      allowTab: false,
      onShow: function() {
        that.$emit('input', true);
      },
      onHide: function() {
        that.$emit('input', false);
      }
    });
  }
};

'use strict';

var $ = require('jquery');

module.exports = {
  template: '<div class="ui page dimmer" ref="modal"><slot></slot></div>',
  props: ['value'],
  watch: {
    value: function(value) {
      $(this.$refs.modal).dimmer(value ? 'show' : 'hide');
    }
  },
  mounted: function() {
    var that = this;
    // It should be directly in <body>
    $('body').get(0).appendChild(that.$el);
    $(that.$refs.modal).dimmer({
      onShow: function() {
        that.$emit('input', true);
      },
      onHide: function() {
        that.$emit('input', false);
      }
    });
  }
};

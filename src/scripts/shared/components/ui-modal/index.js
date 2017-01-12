'use strict';

var $ = require('jquery');

module.exports = {
  template: [
    '<div class="dimmable">',
    '<div class="ui page dimmer" ref="modal">',
    '<slot></slot></div>',
    '</div>'
  ].join(''),
  props: ['value'],
  watch: {
    value: function(newValue, oldValue) {
      if (newValue != oldValue) {
        $(this.$refs.modal).dimmer(newValue ? 'show' : 'hide');
      }
    }
  },
  mounted: function() {
    var that = this;
    var body = $('body');

    // It should be directly in <body>
    body.get(0).appendChild(that.$el);

    // Initialize modal
    $(that.$refs.modal).dimmer({
      onShow: function() {
        if (!that.value) {
          that.$emit('input', true);
        }
      },
      onHide: function() {
        if (that.value) {
          that.$emit('input', false);
        }
      }
    });

    // Handle <esc> key
    function keyHandler(event) {
      if (that.value) {
        var modifiers = event.ctrlKey || event.altKey ||
          event.metaKey || event.shiftKey;
        if ((event.which == 27) && !modifiers) {
          $(that.$refs.modal).dimmer('hide');
        }
      }
    }
    body.on('keyup', keyHandler);
    this.$on('destroy', function() {
      body.off('keyup', keyHandler);
    });
  },
  beforeDestroy: function() {
    this.$emit('destroy');
  }
};

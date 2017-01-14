'use strict';

var tartan = require('tartan');
var utils = require('../utils');

module.exports = {
  template: '<div class="tartan-image"><canvas ref="canvas"></canvas></div>',
  props: ['threadcount', 'schema', 'repeat'],
  watch: {
    threadcount: function() {
      this.$emit('update');
    },
    schema: function() {
      this.$emit('update');
    },
    repeat: function() {
      this.$emit('repaint');
    }
  },
  mounted: function() {
    var that = this;
    var render = null;

    var repaint = tartan.utils.repaint(function() {
      if (that.$refs.canvas) {
        render(that.$refs.canvas, null, that.repeat);
      }
    });

    var disableResize = utils.makeResizable(
      that.$refs.canvas.parentNode,
      function() {
        utils.updateCanvasSize(that.$refs.canvas);
        repaint.flush();
      }
    );

    that.$on('repaint', function() {
      repaint();
    });

    that.$on('update', function() {
      render = utils.createTartanRenderer(that.threadcount, that.schema);
      utils.updateCanvasSize(that.$refs.canvas);
      repaint.flush();
    });

    that.$on('destroy', function() {
      disableResize();
    });

    // Initial paint
    this.$emit('update');
  },
  beforeDestroy: function() {
    this.$emit('destroy');
  }
};

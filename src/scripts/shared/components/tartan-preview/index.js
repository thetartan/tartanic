'use strict';

var _ = require('lodash');
var tartan = require('tartan');
var utils = require('../utils');

module.exports = {
  template: '<div class="tartan-preview-control">' +
    '<canvas ref="canvas"></canvas></div>',
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
    var offset = {x: 0, y: 0};
    var repaint = tartan.utils.repaint(function() {
      if (that.$refs.canvas) {
        var newOffset = render(that.$refs.canvas, offset, that.repeat);
        _.extend(offset, newOffset);
      }
    });

    var disableDrag = utils.makeDraggable(
      that.$refs.canvas,
      _.constant(offset),
      repaint
    );
    var disableResize = utils.makeResizable(that.$refs.canvas.parentNode,
      function() {
        utils.updateCanvasSize(that.$refs.canvas);
        repaint();
      });

    that.$on('repaint', function() {
      repaint();
    });

    that.$on('update', function() {
      render = utils.createTartanRenderer(that.threadcount, that.schema);
      utils.updateCanvasSize(that.$refs.canvas);
      repaint();
    });

    that.$on('destroy', function() {
      disableDrag();
      disableResize();
    });

    // Initial paint
    that.$emit('update');
  },
  beforeDestroy: function() {
    this.$emit('destroy');
  }
};

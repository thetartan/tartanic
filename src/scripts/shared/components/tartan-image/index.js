'use strict';

/* global window */

var _ = require('lodash');
var tartan = require('tartan');

function getDevicePixelRatio() {
  return parseFloat(window.devicePixelRatio) || 1;
}

function updateCanvasSize(canvas) {
  var parent = canvas.parentNode;
  var w = parent.offsetWidth;
  var h = parent.offsetHeight;
  var ratio = getDevicePixelRatio();

  canvas.style.position = 'absolute';
  canvas.style.left = '0px';
  canvas.style.top = '0px';
  canvas.style.width = Math.round(w) + 'px';
  canvas.style.height = Math.round(h) + 'px';

  w = Math.ceil(w * ratio);
  h = Math.ceil(h * ratio);
  if (canvas.width != w) {
    canvas.width = w;
  }
  if (canvas.height != h) {
    canvas.height = h;
  }
}

function makeResizable(window, update) {
  function onResize() {
    if (_.isFunction(update)) {
      update();
    }
  }

  window.addEventListener('resize', onResize);
  return function() {
    window.removeEventListener('resize', onResize);
  };
}

function createRenderer(threadcount) {
  var schema = tartan.schema.extended;
  var sett = schema.parse()(threadcount);
  return tartan.render.canvas(sett, {
    defaultColors: tartan.schema.extended.colors,
    weave: tartan.defaults.weave.serge,
    transformSyntaxTree: tartan.transform.flatten()
  });
}

module.exports = {
  template: '<div class="tartan-image"><canvas ref="canvas"></canvas></div>',
  props: ['threadcount'],
  watch: {
    threadcount: function(value) {
      this.$emit('update', value);
    }
  },
  mounted: function() {
    var that = this;

    var disableResize = makeResizable(window, function() {
      updateCanvasSize(that.$refs.canvas);
      repaint();
    });

    var render = createRenderer(that.threadcount);

    var repaint = tartan.utils.repaint(function() {
      if (that.$refs.canvas) {
        render(that.$refs.canvas, null, true);
      }
    });

    that.$on('update', function(threadcount) {
      render = createRenderer(threadcount);
      repaint();
    });

    that.$on('destroy', function() {
      disableResize();
    });

    // Initial paint
    updateCanvasSize(that.$refs.canvas);
    repaint();
  },
  beforeDestroy: function() {
    this.$emit('destroy');
  }
};

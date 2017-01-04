'use strict';

/* global window */

var _ = require('lodash');
var tartan = require('tartan');

function getDevicePixelRatio() {
  return parseFloat(window.devicePixelRatio) || 1;
}

function makeDraggable(window, canvas, getOffset, repaint) {
  var document = window.document;
  var drag = null;
  var dragTarget = document.releaseCapture ? canvas : window;

  function onMouseDown(event) {
    event = event || window.event;
    if (event.target !== canvas) {
      return;
    }
    if (event.buttons == 1) {
      event.preventDefault();
      drag = {
        x: event.clientX,
        y: event.clientY
      };
      if (event.target && event.target.setCapture) {
        // Only IE and FF
        event.target.setCapture();
      }
    }
  }
  function onMouseMove(event) {
    event = event || window.event;
    if (drag) {
      if (event.buttons != 1) {
        drag = null;
        if (document.releaseCapture) {
          // Only IE and FF
          document.releaseCapture();
        }
      } else {
        var offset = getOffset();
        offset.x += event.clientX - drag.x;
        offset.y += event.clientY - drag.y;

        drag.x = event.clientX;
        drag.y = event.clientY;

        event.preventDefault();
      }

      repaint();
    }
  }
  function onMouseUp(event) {
    event = event || window.event;
    if (event.buttons == 1) {
      drag = null;
      if (document.releaseCapture) {
        // Only IE and FF
        document.releaseCapture();
      }
    }
    repaint();
  }
  function onLoseCapture() {
    // Only IE and FF
    drag = null;
  }

  dragTarget.addEventListener('mousedown', onMouseDown);
  dragTarget.addEventListener('mousemove', onMouseMove);
  dragTarget.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('losecapture', onLoseCapture);

  return function() {
    dragTarget.removeEventListener('mousedown', onMouseDown);
    dragTarget.removeEventListener('mousemove', onMouseMove);
    dragTarget.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('losecapture', onLoseCapture);
  };
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

    var disableDrag = makeDraggable(window, that.$refs.canvas,
      _.constant(offset), repaint);
    var disableResize = makeResizable(window, function() {
      updateCanvasSize(that.$refs.canvas);
      repaint();
    });

    that.$on('repaint', function() {
      repaint();
    });

    that.$on('update', function() {
      render = createRenderer(that.threadcount, that.schema);
      updateCanvasSize(that.$refs.canvas);
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

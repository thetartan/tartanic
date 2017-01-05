'use strict';

/* global window */

var _ = require('lodash');
var tartan = require('tartan');
var domUtils = require('../../../services/utils/dom');

function updateCanvasSize(canvas) {
  var parent = canvas.parentNode;
  var w = parent.offsetWidth;
  var h = parent.offsetHeight;
  var ratio = parseFloat(window.devicePixelRatio) || 1;

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

function createTartanRenderer(threadcount, schema) {
  schema = tartan.schema[schema] || tartan.schema.classic;
  var sett = schema.parse()(threadcount);
  return tartan.render.canvas(sett, {
    defaultColors: tartan.schema.extended.colors,
    weave: tartan.defaults.weave.serge,
    transformSyntaxTree: tartan.transform.flatten()
  });
}

function makeDraggable(element, getOffset, dragHandler) {
  var document = window.document;
  var drag = null;
  var dragTarget = document.releaseCapture ? element : window;

  function onMouseDown(event) {
    event = event || window.event;
    if (event.target !== element) {
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

      dragHandler();
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
    dragHandler();
  }
  function onLoseCapture() {
    // Only IE and FF
    drag = null;
  }

  dragTarget.addEventListener('mousedown', onMouseDown);
  dragTarget.addEventListener('mousemove', onMouseMove);
  dragTarget.addEventListener('mouseup', onMouseUp);
  element.addEventListener('losecapture', onLoseCapture);

  return function() {
    dragTarget.removeEventListener('mousedown', onMouseDown);
    dragTarget.removeEventListener('mousemove', onMouseMove);
    dragTarget.removeEventListener('mouseup', onMouseUp);
    element.removeEventListener('losecapture', onLoseCapture);
  };
}

function makeResizable(element, resizeHandler) {
  if (!_.isFunction(resizeHandler)) {
    return _.identity;
  }

  domUtils.requestResizeEvents(element);
  element.addEventListener('resize', resizeHandler);

  return function() {
    element.removeEventListener('resize', resizeHandler);
    domUtils.cancelResizeEvents(element);
  };
}

module.exports.updateCanvasSize = updateCanvasSize;
module.exports.createTartanRenderer = createTartanRenderer;
module.exports.makeDraggable = makeDraggable;
module.exports.makeResizable = makeResizable;

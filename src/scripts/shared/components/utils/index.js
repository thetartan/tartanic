'use strict';

/* global window */

var _ = require('lodash');
var tartan = require('tartan');
var domUtils = require('../../../services/utils/dom');

function updateCanvasSize(canvas) {
  var parent = canvas.parentNode;
  var w = Math.ceil(parent.offsetWidth);
  var h = Math.ceil(parent.offsetHeight);

  canvas.style.position = 'absolute';
  canvas.style.left = '0px';
  canvas.style.top = '0px';
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';

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

function makeDraggableWithMouse(element, getOffset, dragHandler) {
  var drag = null;

  function isLeftButton(event) {
    if (event.type == 'mousemove') {
      return (event.type == 'mousemove') && (event.buttons == 1);
    } else {
      return (event.which == 1) && (
        (event.buttons == 0) || (event.buttons == 1)
      );
    }
  }

  function mouseDownHandler(event) {
    event = event || window.event;
    if (event.target !== element) {
      return;
    }
    if (isLeftButton(event)) {
      event.preventDefault();
      var position = event;
      drag = {
        x: position.clientX,
        y: position.clientY
      };
      dragHandler();
    }
  }

  function mouseMoveHandler(event) {
    event = event || window.event;
    if (drag) {
      event.preventDefault();
      if (isLeftButton(event)) {
        var offset = getOffset();
        var position = event;
        offset.x += position.clientX - drag.x;
        offset.y += position.clientY - drag.y;

        drag.x = position.clientX;
        drag.y = position.clientY;
      } else {
        drag = null;
      }
      dragHandler();
    }
  }

  function preventClick(event) {
    event = event || window.event;
    event.target.removeEventListener('click', preventClick, true);
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation == 'function') {
      event.stopImmediatePropagation();
    }
    event.returnValue = false;
    return false;
  }

  function mouseUpHandler(event) {
    event = event || window.event;
    if (drag && isLeftButton(event)) {
      event.preventDefault();
      event.target.addEventListener('click', preventClick, true);
      drag = null;
      dragHandler();
    }
  }

  window.addEventListener('mousedown', mouseDownHandler, true);
  window.addEventListener('mousemove', mouseMoveHandler, true);
  window.addEventListener('mouseup', mouseUpHandler, true);

  return function() {
    window.removeEventListener('mousedown', mouseDownHandler, true);
    window.removeEventListener('mousemove', mouseMoveHandler, true);
    window.removeEventListener('mouseup', mouseUpHandler, true);
  };
}

function makeDraggableWithTouch(element, getOffset, dragHandler) {
  var drag = null;

  function touchStartHandler(event) {
    event = event || window.event;
    if (event.touches.length == 1) {
      if (event.target !== element) {
        return;
      }
      var position = event.touches[0];
      drag = {
        x: position.pageX,
        y: position.pageY
      };
      dragHandler();
    } else {
      if (drag) {
        drag = null;
        dragHandler();
      }
    }
  }

  function touchMoveHandler(event) {
    event = event || window.event;
    if (drag) {
      event.preventDefault();
      if (event.touches.length == 1) {
        var offset = getOffset();
        var position = event.touches[0];
        offset.x += position.pageX - drag.x;
        offset.y += position.pageY - drag.y;

        drag.x = position.pageX;
        drag.y = position.pageY;
      } else {
        drag = null;
      }
      dragHandler();
    }
  }

  function touchEndHandler(event) {
    event = event || window.event;
    if (drag) {
      event.preventDefault();
      drag = null;
      dragHandler();
    }
  }

  function touchCancelHandler(event) {
    event = event || window.event;
    if (drag) {
      drag = null;
      dragHandler();
    }
  }

  window.addEventListener('touchstart', touchStartHandler);
  window.addEventListener('touchmove', touchMoveHandler);
  window.addEventListener('touchend', touchEndHandler);
  window.addEventListener('touchcancel', touchCancelHandler);

  return function() {
    window.removeEventListener('touchstart', touchStartHandler);
    window.removeEventListener('touchmove', touchMoveHandler);
    window.removeEventListener('touchend', touchEndHandler);
    window.removeEventListener('touchcancel', touchCancelHandler);
  };
}

function makeDraggable(element, getOffset, dragHandler) {
  if (domUtils.supports.isTouchDevice) {
    return makeDraggableWithTouch(element, getOffset, dragHandler);
  } else {
    return makeDraggableWithMouse(element, getOffset, dragHandler);
  }
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

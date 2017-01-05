'use strict';

/* global window, Event, HTMLElement */

var items = [];

var requestAnimationFrame = (function() {
  var result = null;
  if (typeof window != 'undefined') {
    result = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  }
  return result || function(callback) {
    setTimeout(callback, 50);
  };
})();

function isHTMLElement(element) {
  return (
    (typeof HTMLElement == 'function') &&
    (element instanceof HTMLElement)
  );
}

function findElement(element) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].element === element) {
      return i;
    }
  }
  return -1;
}

function triggerResizeEvent(element) {
  element.dispatchEvent(new Event('resize'));
}

function checkUpdates() {
  if (items.length == 0) {
    return;
  }
  // Check each item
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var rect = item.element.getBoundingClientRect();
    var width = Math.abs(rect.right - rect.left);
    var height = Math.abs(rect.bottom - rect.top);
    if ((width != item.width) || (height != item.height)) {
      item.width = width;
      item.height = height;
      triggerResizeEvent(item.element);
    }
  }
  // Schedule next check
  requestAnimationFrame(checkUpdates);
}

function requestResizeEvents(element) {
  if (!isHTMLElement(element)) {
    return;
  }
  var found = findElement(element) >= 0;
  if (!found) {
    items.push({
      element: element,
      width: -1,
      height: -1
    });
    checkUpdates();
  }
}

function cancelResizeEvents(element) {
  if (!isHTMLElement(element)) {
    return;
  }
  var index = findElement(element);
  if (index >= 0) {
    items.splice(index, 1);  // remove
  }
}

module.exports.requestResizeEvents = requestResizeEvents;
module.exports.cancelResizeEvents = cancelResizeEvents;

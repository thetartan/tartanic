'use strict';

/* global window, Event, HTMLElement */

var items = [];

var check = [
  'clientWidth',
  'clientHeight',
  'offsetWidth',
  'offsetHeight'
];

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
    // Check each sensitive property, and break after any change
    for (var j = 0; j < check.length; j++) {
      var prop = check[j];
      if (item.element[prop] != item[prop]) {
        item[prop] = item.element[prop];
        triggerResizeEvent(item.element);
        break;
      }
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

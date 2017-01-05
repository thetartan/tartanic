'use strict';

/* global window, TouchEvent */

Object.defineProperty(module.exports, 'touchEvents', {
  configurable: false,
  enumerable: true,
  get: function() {
    return typeof TouchEvent == 'function';
  }
});

Object.defineProperty(module.exports, 'isTouchDevice', {
  configurable: false,
  enumerable: true,
  get: function() {
    return (
      ('ontouchstart' in window) ||
      (window.navigator.maxTouchPoints > 0) ||
      (window.navigator.msMaxTouchPoints > 0)
    );
  }
});

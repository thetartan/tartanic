'use strict';

function hiddenProperty(target, name, value) {
  Object.defineProperty(target, name, {
    configurable: true,
    enumerable: false,
    value: value,
    writable: true
  });
  return target;
}

module.exports = hiddenProperty;

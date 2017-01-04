'use strict';

function assign(target, name, value) {
  Object.defineProperty(target, name, {
    configurable: true,
    enumerable: false,
    value: value,
    writable: true
  });
  return target;
}

module.exports.assign = assign;

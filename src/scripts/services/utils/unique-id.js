'use strict';

var hiddenProperty = require('./hidden-property');

function format(group, value) {
  if ((group === undefined) || (group === null)) {
    group = '';
  }
  return JSON.stringify([group, value]);
}

function factory() {
  var groups = {};
  return function(group) {
    if ((group === undefined) || (group === null)) {
      group = '';
    }
    if (!groups.hasOwnProperty(group)) {
      groups[group] = 0;
    }
    groups[group] += 1;
    return format(group, groups[group]);
  };
}

var get = factory();  // default generator

function assign(target, value) {
  hiddenProperty.assign(target, '$ref', value === undefined ? get() : value);
}

module.exports = factory;
module.exports.format = format;
module.exports.get = get;
module.exports.assign = assign;

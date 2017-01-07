'use strict';

var _ = require('lodash');
var hiddenProperty = require('./hidden-property');

function factory() {
  var groups = {};
  return function(group, id) {
    if ((group === undefined) || (group === null)) {
      group = '';
    }
    if ((id === undefined) || (id === null)) {
      if (!groups.hasOwnProperty(group)) {
        groups[group] = 0;
      }
      groups[group] += 1;
      id = groups[group];
    }
    return JSON.stringify([group, id]);
  };
}

var get = factory();  // default generator

function assign(target, value) {
  hiddenProperty.assign(target, '$ref', value);
}

function createHandle(type, value) {
  var result = {};
  result[type] = value;
  return JSON.stringify(result);
}

function getHandleType(handle) {
  try {
    handle = JSON.parse(handle);
  } catch(e) {
    return null;
  }
  return _.isObject(handle) ? _.first(_.keys(handle)) : null;
}

module.exports = factory;
module.exports.get = get;
module.exports.assign = assign;
module.exports.createHandle = createHandle;
module.exports.getHandleType = getHandleType;

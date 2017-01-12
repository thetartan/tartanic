'use strict';

/* global document */

var _ = require('lodash');
var tartan = require('tartan');
var Promise = require('bluebird');

function getTartanDescriptor(item, schema) {
  var result;
  if (_.isObject(item.$raw) && !_.isArrayLike(item.$raw)) {
    result = item.$raw;
    result.Schema = _.isString(schema) ? schema : 'classic';
  } else {
    result = _.extend({}, item);
    result.schema = _.isString(schema) ? schema : 'classic';
  }
  return Promise.resolve(result);
}

function getTartanImage(item, schema) {
  schema = tartan.schema[schema] || tartan.schema.classic;
  var sett = schema.parse()(item.sett);
  var render = tartan.render.canvas(sett, {
    defaultColors: tartan.schema.extended.colors,
    weave: tartan.defaults.weave.serge,
    transformSyntaxTree: tartan.transform.flatten()
  });
  var canvas = document.createElement('canvas');
  canvas.width = render.metrics.warp.length;
  canvas.height = render.metrics.weft.length;
  render(canvas, {x: 0, y: 0}, false);
  var url = canvas.toDataURL('image/png');
  return fetch(url).then(function(response) {
    return response.arrayBuffer();
  });
}

module.exports.getTartanDescriptor = getTartanDescriptor;
module.exports.getTartanImage = getTartanImage;

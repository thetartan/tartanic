'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

var resourceMediaType = {
  csv: 'text/csv',
  json: 'application/json'
};

function handleFetchResponse(response) {
  if (response.status != 200) {
    throw new Error('Failed loading data from ' + response.url);
  }
  return response.arrayBuffer();
}

function getDataPackage(dataset) {
  var result = _.extend({}, dataset.meta);
  var path = dataset.resources.length > 1 ? 'data/' : '';
  result.resources = _.map(dataset.resources, function(resource) {
    var result = _.omit(resource.meta, ['data', 'path', 'url',
      'mediatype', 'format']);

    result.path = path + resource.meta.name + '.' + resource.format;
    result.format = resource.format.toUpperCase();
    if (resourceMediaType[resource.format]) {
      result.mediatype = resourceMediaType[resource.format];
    }
    return result;
  });
  return Promise.resolve(result);
}

function getResource(resource) {
  return fetch(resource.url)
    .then(handleFetchResponse)
    .then(function(buffer) {
      return new Uint8Array(buffer);
    });
}

module.exports.getDataPackage = getDataPackage;
module.exports.getResource = getResource;

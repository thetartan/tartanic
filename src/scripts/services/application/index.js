'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var utils = require('../utils');
var dataPackage = require('../datapackage');

function getConfig(configUrl) {
  return fetch(configUrl).then(function(response) {
    if (response.status != 200) {
      throw new Error('Failed loading data from ' + response.url);
    }
    return response.text();
  }).then(JSON.parse);
}

function getDatasets(datasets) {
  var promises = _.map(datasets, function(url) {
    return dataPackage.loadDataPackage(url);
  });
  return Promise.all(promises).then(function(results) {
    return _.map(results, function(item) {
      utils.hiddenProperty(item, '$ref', utils.uniqueId.createHandle(
        'dataset', item.meta.name
      ));

      item.countOfRecords = 100 + _.chain(item.resources)
        .map(function(resource) {
          var result = parseInt(resource.countOfRecords, 10) || 0;
          return result > 0 ? result : 0;
        })
        .sum()
        .value();

      return item;
    });
  });
}

function getDataset(dataset, pickAttributes) {
  var resource = _.first(dataset.resources);
  return dataPackage.loadResource(resource, dataset.url, pickAttributes)
    .then(function(result) {
      var datasetRef = dataset.meta.name;
      var resourceRef = resource.name;
      var group = datasetRef + '/' + resourceRef;

      result.items = _.chain(result.items)
        .map(function(item) {
          // Assign unique ids to each item; if item has own internal
          // unique id - use it, otherwise generate
          utils.hiddenProperty(item, '$ref', utils.uniqueId.createHandle(
            'tartan', utils.uniqueId.get(group, item.id)
          ));

          // Save dataset and resource references
          utils.hiddenProperty(item, '$dataset', datasetRef);
          utils.hiddenProperty(item, '$resource', resourceRef);

          return item;
        })
        .sortBy('name')
        .value();

      return result;
    });
}

module.exports.getConfig = getConfig;
module.exports.getDatasets = getDatasets;
module.exports.getDataset = getDataset;

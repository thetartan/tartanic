'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var utils = require('../utils');
var dataPackage = require('../datapackage');
var tartanUtils = require('./tartan');
var datasetUtils = require('./dataset');
var TextEncoder = require('text-encoding').TextEncoder;
var slug = require('slug');

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
    return _.chain(results)
      .filter(function(item) {
        return item.resources.length > 0;
      })
      .map(function(item) {
        var datasetRef = item.meta.name;
        utils.hiddenProperty(item, '$ref', utils.uniqueId.createHandle(
          'dataset', datasetRef
        ));

        _.each(item.resources, function(item) {
          var resourceRef = item.meta.name;
          utils.hiddenProperty(item, '$ref', utils.uniqueId.createHandle(
            'resource', datasetRef + '/' + resourceRef
          ));
          // Save dataset reference
          utils.hiddenProperty(item, '$dataset', datasetRef);
        });

        item.countOfRecords = _.chain(item.resources)
          .map(function(resource) {
            var result = parseInt(resource.countOfRecords, 10) || 0;
            return result > 0 ? result : 0;
          })
          .sum()
          .value();

        return item;
      })
      .value();
  });
}

function getDataset(dataset, pickAttributes) {
  var promises = _.map(dataset.resources, function(resource) {
    return dataPackage.loadResource(resource, pickAttributes);
  });
  return Promise.all(promises)
    .then(function(results) {
      return _.map(results, function(result) {
        var datasetRef = dataset.meta.name;
        var resourceRef = result.meta.name;
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
    });
}

function getDatasetFiles(dataset) {
  var promises = [];
  promises.push(datasetUtils.getDataPackage(dataset));
  _.each(dataset.resources, function(resource) {
    promises.push(datasetUtils.getResource(resource));
  });

  return Promise.all(promises).then(function(results) {
    var encoder = new TextEncoder('utf-8');
    var dataPackage = results[0];

    var result = _.chain(results)
      .drop()
      .map(function(data, index) {
        var resource = dataPackage.resources[index];
        resource.bytes = data.length;
        return {
          name: resource.path,
          data: data
        };
      })
      .value();

    // Prepend
    result.unshift({
      name: 'datapackage.json',
      data: encoder.encode(JSON.stringify(dataPackage, null, 2))
    });
    return result;
  });
}

function getTartanFiles(tartan, schema, baseName) {
  return Promise.all([
    tartanUtils.getTartanDescriptor(tartan, schema),
    tartanUtils.getTartanImage(tartan, schema)
  ]).then(function(results) {
    var encoder = new TextEncoder('utf-8');
    baseName = baseName || slug(tartan.name);
    return [
      {
        name: baseName + '.json',
        data: encoder.encode(JSON.stringify(results[0], null, 2))
      },
      {
        name: baseName + '.png',
        data: new Uint8Array(results[1])
      }
    ];
  });
}

module.exports.slug = slug;
module.exports.getConfig = getConfig;
module.exports.getDatasets = getDatasets;
module.exports.getDataset = getDataset;
module.exports.getDatasetFiles = getDatasetFiles;
module.exports.getTartanFiles = getTartanFiles;

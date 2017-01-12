'use strict';

var _ = require('lodash');
var url = require('url');
var Promise = require('bluebird');
var utils = require('./utils');

function handleFetchResponse(response) {
  if (response.status != 200) {
    throw new Error('Failed loading data from ' + response.url);
  }
  return response.text();
}

function createResource(resource, dataPackageUrl) {
  var resourceUrl = null;
  if (resource.path) {
    resourceUrl = utils.isUrl(resource.path) ? resource.path :
      url.resolve(dataPackageUrl, resource.path);
  } else if (utils.isUrl(resource.url)) {
    resourceUrl = resource.url;
  }
  return {
    name: resource.title || resource.name,
    meta: resource,
    url: resourceUrl,
    items: []
  };
}

function loadResource(resource, pickAttributes) {
  if (resource.url) {
    return fetch(resource.url)
      .then(handleFetchResponse)
      .then(function(data) {
        return utils.getCSVData(data, resource.meta.encoding);
      })
      .then(function(records) {
        var attributes = resource.meta.attributes;
        var fields = _.get(resource.meta, 'schema.fields');
        if (!_.isArray(fields) && !_.isObject(fields)) {
          fields = [];
        }
        if (!_.isObject(attributes)) {
          attributes = {};
          _.each(fields, function(field) {
            attributes[field.name] = field.name;
          });
        }

        var headers = null;
        if (resource.meta.headers) {
          // Pick headers and remove them from list
          headers = _.first(records);
          records.splice(0, 1);
        }

        var headerMapper = _.identity;
        if (_.isArray(headers)) {
          headerMapper = function(record) {
            return _.fromPairs(_.zip(headers, record));
          };
        }

        var attributeMapper = headerMapper;
        if (fields && attributes) {
          attributeMapper = utils.createAttributeMapper(fields,
            attributes, pickAttributes);
        }

        resource.items = _.map(records, function(record) {
          var result = attributeMapper(record);

          // Save original "raw" records alongside mapped item
          utils.hiddenProperty(result, '$record', record);
          utils.hiddenProperty(result, '$raw', headerMapper(record));

          return result;
        });

        return resource;
      });
  }
  return Promise.reject(new Error('Cannot load resource ' + resource.name));
}

function loadDataPackage(dataPackageUrl) {
  return fetch(dataPackageUrl)
    .then(handleFetchResponse)
    .then(JSON.parse)
    .then(function(dataPackage) {
      return {
        name: dataPackage.title || dataPackage.name,
        meta: _.omit(dataPackage, ['resources']),
        url: dataPackageUrl,
        resources: _.map(dataPackage.resources, function(resource) {
          return createResource(resource, dataPackageUrl);
        })
      };
    });
}

module.exports.loadDataPackage = loadDataPackage;
module.exports.loadResource = loadResource;

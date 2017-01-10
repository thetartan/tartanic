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

function loadResource(resource, dataPackageUrl, pickAttributes) {
  var resourceUrl = null;
  if (resource.path) {
    resourceUrl = utils.isUrl(resource.path) ? resource.path :
      url.resolve(dataPackageUrl, resource.path);
  } else if (utils.isUrl(resource.url)) {
    resourceUrl = resource.url;
  }
  if (resourceUrl) {
    var resourceData = null;
    return fetch(resourceUrl)
      .then(handleFetchResponse)
      .then(function(data) {
        resourceData = utils.encoder.encode(data);
        return utils.getCSVData(data, resource.encoding);
      })
      .then(function(records) {
        var attributes = resource.attributes;
        var fields = _.get(resource, 'schema.fields');
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
        if (resource.headers) {
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

        return {
          meta: resource,
          url: resourceUrl,
          bytes: resourceData,
          items: _.map(records, function(record) {
            var result = attributeMapper(record);

            // Save original "raw" records alongside mapped item
            utils.hiddenProperty(result, '$record', record);
            utils.hiddenProperty(result, '$raw', headerMapper(record));

            return result;
          })
        };
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
        meta: _.omit(dataPackage, ['resources']),
        url: dataPackageUrl,
        resources: dataPackage.resources
      };
    });
}

module.exports.loadDataPackage = loadDataPackage;
module.exports.loadResource = loadResource;

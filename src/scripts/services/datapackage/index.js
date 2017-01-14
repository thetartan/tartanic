'use strict';

var _ = require('lodash');
var url = require('url');
var Promise = require('bluebird');
var utils = require('./utils');

// TODO: Resource's `path` property may be an array
// containing multiple parts of the resource data.

function handleFetchResponse(response) {
  if (response.status != 200) {
    throw new Error('Failed loading data from ' + response.url);
  }
  return response.text();
}

function getResourceFormatFromMediaType(value) {
  // lower-case it and drop `charset=` part
  value = utils.toLowerCase(value).split(';')[0];
  switch (value) {
    case 'text/csv':
    case 'application/csv':
      return 'csv';
    case 'application/json':
    case 'application/x-json':
    case 'text/json':
    case 'text/x-json':
      return 'json';
    default:
      return '';
  }
}

function getResourceFormat(resource, response) {
  var ownFormat = utils.toLowerCase(resource.format);
  if (['csv', 'json'].indexOf(ownFormat) == -1) {
    ownFormat = '';
  }

  var fromOwnMediaType = getResourceFormatFromMediaType(resource.mediatype);

  var fromRealMediaType = '';
  if (response && response.headers) {
    fromRealMediaType = getResourceFormatFromMediaType(
      response.headers.get('Content-Type'));
  }

  return fromRealMediaType || ownFormat || fromOwnMediaType;
}

function createResource(resource, dataPackageUrl) {
  var resourceUrl = null;
  var resourceData = null;
  if (resource.data) {
    resourceData = resource.data;
  } else if (resource.path) {
    resourceUrl = utils.isUrl(resource.path) ? resource.path :
      url.resolve(dataPackageUrl, resource.path);
  } else if (utils.isUrl(resource.url)) {
    resourceUrl = resource.url;
  }
  return {
    name: resource.title || resource.name,
    meta: resource,
    data: resourceData,
    url: resourceUrl,
    format: getResourceFormat(resource),
    items: []
  };
}

function getResourceData(resource) {
  if (resource.data) {
    return Promise.resolve(resource.data);
  } else if (resource.url) {
    return fetch(resource.url).then(function(response) {
      resource.format = getResourceFormat(resource.meta, response);
      return handleFetchResponse(response);
    });
  } else {
    return Promise.resolve([]);
  }
}

// Records should be an array of arrays or objects; array items will
// be remapped using `resource.attributes` rules, objects will be left
// as is - it allows to handle both csv and json data.
function processResourceRecords(resource, records, pickAttributes) {
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
    var result = _.isArray(record) ? attributeMapper(record) : record;

    // Save original "raw" records alongside mapped item
    utils.hiddenProperty(result, '$record', record);
    utils.hiddenProperty(result, '$raw', headerMapper(record));

    return result;
  });

  return resource;
}

function loadResource(resource, pickAttributes) {
  return getResourceData(resource)
    .then(function(data) {
      if (_.isString(data)) {
        // Parse string data depending on resource format
        switch (resource.format) {
          case 'csv':
            return utils.getCSVData(data, resource.meta.encoding);
          case 'json':
            return utils.getJSONData(data);
          default:
            throw new Error('Unknown resource type: ' +
              JSON.stringify(resource.type));
        }
      }
      return data;
    })
    .then(function(records) {
      // 1. if data is an array - leave only nested arrays and object
      // 2. if data is an object - cast it to array with that object
      // 3. other formats are not supported, so take a default value
      if (_.isArray(records)) {
        records = _.filter(records, _.isObject);
      } else {
        records = _.isObject(records) ? [records] : [];
      }
      return processResourceRecords(resource, records, pickAttributes);
    });
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

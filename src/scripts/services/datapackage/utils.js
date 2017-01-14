'use strict';

var _ = require('lodash');
var TextEncoder = require('text-encoding').TextEncoder;
var Promise = require('bluebird');
var csv = require('papaparse');
var url = require('url');

function isUrl(value) {
  var result = url.parse(value);
  if (result) {
    var schema = ('' + result.schema).toLowerCase();
    return (schema == 'http') || (schema == 'https');
  }
  return false;
}

function toLowerCase(value) {
  return ('' + value).toLowerCase();
}

function hiddenProperty(target, name, value) {
  Object.defineProperty(target, name, {
    configurable: true,
    enumerable: false,
    value: value,
    writable: true
  });
  return target;
}

function getPapaParseError(parseErrors) {
  parseErrors = _.filter(parseErrors, function(error) {
    // Delimiter was not auto-detected (defaults used).
    // We'll not treat this as an error
    var delimiterNotDetected = (error.type == 'Delimiter') &&
      (error.code == 'UndetectableDelimiter');

    return !delimiterNotDetected;
  });
  if (parseErrors.length > 0) {
    return new Error(parseErrors[0].message);
  }
}

function getCSVData(string, encoding) {
  return new Promise(function(resolve, reject) {
    var config = {
      download: false,
      encoding: encoding,
      header: false,
      skipEmptyLines: true,
      error: function(error) {
        reject(new Error('Failed to parse: ' + error));
      },
      complete: function(results) {
        var error = getPapaParseError(results.errors);
        if (error) {
          reject(error);
        } else {
          resolve(results.data);
        }
      }
    };
    csv.parse(string, config);
  });
}

function getJSONData(string) {
  var result;
  try {
    result = JSON.parse(string);
  } catch (e) {
    result = null;
  }
  return Promise.resolve(result);
}

function createAttributeMapper(fields, attributes, pickAttributes) {
  if (_.isString(pickAttributes) || _.isArray(pickAttributes)) {
    attributes = _.pick(attributes, pickAttributes);
  }

  var fieldIndex = _.chain(fields)
    .map(function(field, index) {
      return [field.name, index];
    })
    .fromPairs()
    .value();

  function compileArguments(args) {
    args = _.isArray(args) ? args : [args];
    return _.chain(args)
      .map(function(value) {
        return _.isUndefined(value) ? 'undefined' : JSON.stringify(value);
      })
      .join(', ')
      .value();
  }

  var mapper = ['var result = {};'];

  _.each(attributes, function(descriptor, name) {
    if (_.isString(descriptor)) {
      if (fieldIndex.hasOwnProperty(descriptor)) {
        mapper.push('result[' + JSON.stringify(name) + '] = ' +
          'row[' + fieldIndex[descriptor] + '];');
      }
    }
    if (_.isArray(descriptor)) {
      mapper.push('var values = [];');

      var isArray = true;
      _.each(descriptor, function(item) {
        if (_.isString(item)) {
          switch (item) {
            case 'trim':
              if (isArray) {
                mapper.push('values = _.map(values, _.trim);');
              } else {
                mapper.push('values = _.trim(values);');
              }
              break;
            case 'filter':
              if (isArray) {
                mapper.push('values = _.filter(values);');
              }
              break;
            case 'unique':
              if (isArray) {
                mapper.push('values = _.uniq(values);');
              }
              break;
            default:
              break;
          }
        }
        if (_.isObject(item)) {
          _.each(item, function(args, func) {
            switch (func) {
              case 'fields':
                args = _.isArray(args) ? args : [args];
                var fields = [];
                _.each(args, function(field) {
                  if (fieldIndex.hasOwnProperty(field)) {
                    fields.push('row[' + fieldIndex[field] + ']');
                  }
                });
                if (fields.length > 0) {
                  if (!isArray) {
                    mapper.push('values = [values];');
                    isArray = true;
                  }
                  mapper.push('values.push(' + fields.join(', ') + ')');
                }
                break;
              case 'values':
                if (!isArray) {
                  mapper.push('values = [values];');
                  isArray = true;
                }
                mapper.push('values.push(' + compileArguments(args) + ')');
                break;
              case 'split':
                if (isArray) {
                  mapper.push('values = _.map(values, function(value) {');
                  mapper.push('return _.split(value, ' +
                    compileArguments(args) + ');');
                  mapper.push('});');
                } else {
                  mapper.push('values = _.split(values, ' +
                    compileArguments(args) + ');');
                }
                isArray = true;
                break;
              case 'join':
                if (isArray) {
                  mapper.push('values = _.join(values, ' +
                    compileArguments(args) + ');');
                  isArray = false;
                }
                break;
              case 'flatten':
                if (isArray) {
                  mapper.push('values = _.flattenDeep(values);');
                }
                break;
              case 'sort':
                if (isArray) {
                  mapper.push('values = _.sortBy(values);');
                  var direction = ('' + _.first(args)).toLowerCase();
                  if (direction == 'desc') {
                    mapper.push('values = _.reverse(values);');
                  }
                }
                break;
              default:
                break;
            }
          });
        }
      });

      mapper.push('result[' + JSON.stringify(name) + '] = values;');
    }
  });

  mapper.push('return result;');

  /* eslint-disable no-new-func */
  mapper = new Function('row', '_', mapper.join('\n'));
  /* eslint-enable no-new-func */
  return function(row) {
    return mapper(row, _);
  };
}

module.exports.encoder = new TextEncoder('utf-8');
module.exports.isUrl = isUrl;
module.exports.toLowerCase = toLowerCase;
module.exports.hiddenProperty = hiddenProperty;
module.exports.createAttributeMapper = createAttributeMapper;
module.exports.getCSVData = getCSVData;
module.exports.getJSONData = getJSONData;

'use strict';

var _ = require('lodash');
var utils = require('../../services/utils');

// Container for readonly data that should not be watched by vue(x)
var storage = {
  config: {},
  datasets: [],

  getItemByRef: function(ref) {
    var result = null;

    var refType = utils.uniqueId.getHandleType(ref);
    switch (refType) {
      case 'dataset':
        result = _.find(storage.datasets, {$ref: ref});
        break;
      case 'tartan':
        _.each(storage.datasets, function(dataset) {
          result = _.find(dataset.items, {$ref: ref});
          return !result;  // Break if found
        });
        break;
    }

    return result ? result : null;
  }
};

module.exports = storage;

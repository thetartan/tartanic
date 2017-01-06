'use strict';

var _ = require('lodash');

// Container for readonly data that should not be watched by vue(x)
var storage = {
  config: {},
  datasets: [],

  getItemByRef: function(ref) {
    // Try find dataset
    var result = _.find(storage.datasets, {$ref: ref});

    // Try find dataset item
    if (!result) {
      _.each(storage.datasets, function(dataset) {
        result = _.find(dataset.items, {$ref: ref});
        return !result;  // Break if found
      });
    }

    return result ? result : null;
  }
};

module.exports = storage;

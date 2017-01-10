'use strict';

var _ = require('lodash');
var utils = require('../../services/utils');

// Container for readonly data that should not be watched by vue(x)
var storage = {
  config: {},
  datasets: []
};

function getStorageItem(itemRef) {
  var result = null;
  var refType = utils.uniqueId.getHandleType(itemRef);
  switch (refType) {
    case 'dataset':
      result = _.find(storage.datasets, {$ref: itemRef});
      break;
    case 'tartan':
      _.each(storage.datasets, function(dataset) {
        result = _.find(dataset.items, {$ref: itemRef});
        return !result;  // Break if found
      });
      break;
  }

  return result ? result : null;
}

module.exports = {
  storage: function() {
    return storage;
  },
  getStorageItem: function() {
    return getStorageItem;
  },
  pageHome: function(state) {
    return _.find(state.pages, {viewAs: 'home'});
  },
  pageAbout: function(state) {
    return _.find(state.pages, {viewAs: 'about'});
  },
  pageFavorite: function(state) {
    return _.find(state.pages, {viewAs: 'favorite'});
  },
  pagePersonal: function(state) {
    return _.find(state.pages, {viewAs: 'personal'});
  },
  pageDatasets: function(state) {
    return _.find(state.pages, {viewAs: 'datasets'});
  },
  pageSettings: function(state) {
    return _.find(state.pages, {viewAs: 'settings'});
  },
  editors: function(state) {
    return _.filter(state.pages, function(item) {
      return item.viewAs == 'editor';
    });
  },
  explorers: function(state) {
    return _.filter(state.pages, function(item) {
      return item.viewAs == 'explorer';
    });
  },
  currentItem: function(state) {
    var currentPage = state.currentPage;
    if (currentPage) {
      return getStorageItem(currentPage.itemRef);
    }
    return null;
  }
};

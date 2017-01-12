'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var applicationService = require('../../services/application');
var utils = require('../../services/utils');

module.exports = {
  viewPage: function(context, page) {
    context.commit('setCurrentPage', page);
  },
  setConfig: function(context, config) {
    storage.config = _.isObject(config) ? config : {};
  },
  createDefaultPages: function(context) {
    context.commit('createDefaultPages');
  },
  setDatasets: function(context, datasets) {
    var storage = context.getters.storage;
    storage.datasets = _.isArray(datasets) ? datasets : [];
    context.state.datasetsCount = storage.datasets.length;
    _.each(storage.datasets, function(dataset) {
      context.commit('setItemState', [dataset.$ref, {
        loaded: false,
        loading: false,
        error: null
      }]);
    });
  },

  toggleFavorites: function(context, itemRef) {
    console.log('favorites', itemRef);
  },

  viewDataset: function(context, datasetRef) {
    var dataset = context.getters.getStorageItem(datasetRef);
    // Create and open editor
    context.commit('createDatasetExplorer', dataset);
    context.commit('updateDatasetExplorer', dataset);
    var page = _.find(context.getters.explorers, {itemRef: dataset.$ref});
    if (page) {
      context.commit('setCurrentPage', page);
    }

    function update(dataset, data, items) {
      dataset.items = _.isArray(items) ? items : [];
      context.commit('setItemState', [dataset.$ref, data]);
      context.commit('updateDatasetExplorer', dataset);
      return dataset;
    }

    // If not items already loaded - load them
    var isLoaded = _.get(context.state.itemState,
      '[' + datasetRef + '].loaded');
    if (isLoaded) {
      return Promise.resolve(datasetRef);
    } else {
      dataset = update(dataset, {
        loaded: false,
        loading: true,
        error: null
      });

      return applicationService.getDataset(dataset)
        .then(function(resources) {
          dataset = update(dataset, {
            loaded: true,
            loading: false,
            error: null
          }, _.first(resources).items);
        })
        .then(function() {
          return datasetRef;
        })
        .catch(function(error) {
          dataset = update(dataset, {
            loaded: true,
            loading: false,
            error: error
          });
        });
    }
  },

  viewTartan: function(context, tartanRef) {
    context.commit('setTartanPreview', {
      isVisible: true,
      itemRef: tartanRef,
      schema: 'extended'
    });
  },
  editTartan: function(context, tartanRef) {
    var tartan = context.getters.getStorageItem(tartanRef);
    context.commit('createTartanEditor', tartan);
    var page = _.find(context.getters.editors, {itemRef: tartan.$ref});
    if (page) {
      context.commit('setCurrentPage', page);
    }
  },

  downloadItem: function(context, itemRef) {
    var item = context.getters.getStorageItem(itemRef);

    function getItemFiles(item) {
      var itemType = utils.uniqueId.getHandleType(item.$ref);
      switch (itemType) {
        case 'tartan':
          return applicationService.getTartanFiles(item, 'extended');
        case 'dataset':
          return applicationService.getDatasetFiles(item);
        default:
          return Promise.reject('Item cannot be downloaded: ' + item.$ref);
      }
    }

    function update(data, check) {
      if (check) {
        var isActive = context.state.downloadFiles.isVisible;
        var isThisItem = context.state.downloadFiles.itemRef == itemRef;
        if (!isActive || !isThisItem) {
          return;
        }
      }
      context.commit('setDownloadFiles', _.extend({
        isVisible: true,
        itemRef: itemRef,

        allowDownloadingPerFile: true,
        baseName: applicationService.slug(item.name),

        loading: false,
        loaded: true,
        error: null,
        files: []
      }, data));
    }

    update({
      loading: true,
      loaded: false
    });

    return getItemFiles(item)
      .then(function(files) {
        update({
          loading: false,
          loaded: true,
          files: files
        }, true);
      })
      .catch(function(error) {
        update({
          loading: false,
          loaded: true,
          error: error
        }, true);
      });
  }
};

'use strict';

var _ = require('lodash');
var storage = require('./storage');
var applicationService = require('../../services/application');

module.exports = {
  viewPage: function(context, page) {
    context.commit('setCurrentPage', page);
  },
  setConfig: function(context, config) {
    storage.config = _.isObject(config) ? config : {};
  },
  setDatasets: function(context, datasets) {
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

  viewDataset: function(context, datasetRef) {
    // Create and open editor
    context.commit('createDatasetExplorer', datasetRef);
    context.commit('updateDatasetExplorer', datasetRef);
    var page = _.find(context.getters.explorers, {itemRef: datasetRef});
    if (page) {
      context.commit('setCurrentPage', page);
    }

    function update(dataset, data, items) {
      dataset.items = _.isArray(items) ? items : [];
      context.commit('setItemState', [dataset.$ref, data]);
      context.commit('updateDatasetExplorer', dataset.$ref);
      return dataset;
    }

    // If not items already loaded - load them
    var isLoaded = _.get(context.state.itemState,
      '[' + datasetRef + '].loaded');
    if (!isLoaded) {
      var dataset = storage.getItemByRef(datasetRef);

      dataset = update(dataset, {
        loaded: false,
        loading: true,
        error: null
      });

      applicationService.getDataset(dataset)
        .then(function(items) {
          dataset = update(dataset, {
            loaded: true,
            loading: false,
            error: null
          }, items);
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
  downloadDataset: function(context, datasetRef) {
    console.log('download dataset', datasetRef);
  },
  likeDataset: function(context, datasetRef) {
    console.log('like dataset', datasetRef);
  },

  viewTartan: function(context, tartanRef) {
    context.commit('setTartanPreview', {
      isVisible: true,
      itemRef: tartanRef,
      schema: 'extended'
    });
  },
  editTartan: function(context, tartanRef) {
    context.commit('createTartanEditor', tartanRef);
    var page = _.find(context.getters.editors, {itemRef: tartanRef});
    if (page) {
      context.commit('setCurrentPage', page);
    }
  },
  downloadTartan: function(context, tartanRef) {
    console.log('download tartan', tartanRef);
  },
  likeTartan: function(context, tartanRef) {
    console.log('like tartan', tartanRef);
  }
};
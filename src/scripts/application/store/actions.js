'use strict';

var _ = require('lodash');
var applicationService = require('../../services/application');

module.exports = {
  viewPage: function(context, page) {
    context.commit('setCurrentPage', page);
  },
  setConfig: function(context, config) {
    var storage = context.getters.storage;
    storage.config = _.isObject(config) ? config : {};
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

  viewDataset: function(context, dataset) {
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
      '[' + dataset.$ref + '].loaded');
    if (!isLoaded) {
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
  downloadDataset: function(context, dataset) {
    console.log('download dataset', dataset);
  },
  likeDataset: function(context, dataset) {
    console.log('like dataset', dataset);
  },

  viewTartan: function(context, tartan) {
    context.commit('setTartanPreview', {
      isVisible: true,
      item: _.extend(_.cloneDeep(tartan), {$ref: tartan.$ref}),
      schema: 'extended'
    });
  },
  editTartan: function(context, tartan) {
    context.commit('createTartanEditor', tartan);
    var page = _.find(context.getters.editors, {itemRef: tartan.$ref});
    if (page) {
      context.commit('setCurrentPage', page);
    }
  },
  downloadTartan: function(context, tartan) {
    console.log('download tartan', tartan);
  },
  likeTartan: function(context, tartan) {
    console.log('like tartan', tartan);
  }
};

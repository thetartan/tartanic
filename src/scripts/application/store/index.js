'use strict';

var _ = require('lodash');
var Vue = require('vue');
var Vuex = require('vuex');
var applicationService = require('../../services/application');

Vue.use(Vuex);

// Container for readonly data that should not be watched by vue(x)
var storage = {
  config: {},
  datasets: []
};

var store = new Vuex.Store({
  state: {
    currentPage: null,
    itemState: {},
    datasetsCount: 0,
    tartanPreview: {
      isVisible: false,
      item: null
    },
    pages: [
      {
        viewAs: 'home',
        title: 'Home'
      },
      {
        viewAs: 'about',
        title: 'About this project'
      },
      {
        viewAs: 'favorite',
        title: 'Favorite tartans'
      },
      {
        viewAs: 'personal',
        title: 'My tartans'
      },
      {
        viewAs: 'datasets',
        title: 'All datasets'
      }
    ]
  },
  getters: {
    storage: function() {
      return storage;
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
    editors: function(state) {
      return _.filter(state.pages, function(item) {
        return item.viewAs == 'editor';
      });
    },
    explorers: function(state) {
      return _.filter(state.pages, function(item) {
        return item.viewAs == 'explorer';
      });
    }
  },
  mutations: {
    setItemState: function(state, payload) {
      var key = payload[0];
      var data = payload[1];
      Vue.set(state.itemState, key, data);
    },
    setCurrentPage: function(state, page) {
      state.currentPage = _.isObject(page) ? page : {};
    },
    createDatasetExplorer: function(state, dataset) {
      var exists = !!_.find(state.pages, {
        viewAs: 'explorer',
        dataset: dataset.name
      });
      if (!exists) {
        state.pages.push({
          viewAs: 'explorer',
          title: dataset.title,
          dataset: dataset.$ref,
          pagination: null
        });
      }
    },
    updateDatasetExplorer: function(state, dataset) {
      var page = _.find(state.pages, {
        viewAs: 'explorer',
        dataset: dataset.$ref
      });
      if (page) {
        var items = _.isArray(dataset.items) ? dataset.items : [];
        var itemsPerPage = 20;
        page.pagination = {
          itemsPerPage: itemsPerPage,
          pageCount: Math.ceil(items.length / itemsPerPage),
          currentPage: 1
        };
      }
    },
    createTartanEditor: function(state, tartan) {
      state.pages.push({
        viewAs: 'editor',
        title: tartan.name,
        item: tartan.$ref,
        state: {
          threadcount: tartan.sett,
          schema: 'extended',
          repeat: true
        }
      });
    },
    setTartanPreview: function(state, data) {
      data = _.extend({}, data);
      state.tartanPreview.item = data.item;
      state.tartanPreview.isVisible = !!data.isVisible;
    }
  },
  actions: {
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
      var page = _.find(context.getters.explorers, {dataset: dataset.name});
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
      var page = _.last(context.state.pages);
      if (page && (page.viewAs == 'editor')) {
        context.commit('setCurrentPage', page);
      }
    },
    downloadTartan: function(context, tartan) {
      console.log('download tartan', tartan);
    },
    likeTartan: function(context, tartan) {
      console.log('like tartan', tartan);
    }
  }
});

module.exports = store;

'use strict';

var _ = require('lodash');
var Vue = require('vue');
var storage = require('./storage');

function computedProperties(object, getters) {
  _.each(getters, function(getter, name) {
    Object.defineProperty(object, name, {
      configurable: true,
      enumerable: true,
      get: getter
    });
  });
  return object;
}

module.exports = {
  setItemState: function(state, payload) {
    var key = payload[0];
    var data = payload[1];
    Vue.set(state.itemState, key, data);
  },
  setCurrentPage: function(state, page) {
    state.currentPage = _.isObject(page) ? page : {};
  },

  createDefaultPages: function(state) {
    state.pages = [
      computedProperties({
        viewAs: 'home',
        additionalActions: []
      }, {
        title: function() {
          return Vue.$t('page.home.title');
        }
      }),
      computedProperties({
        viewAs: 'about',
        additionalActions: []
      }, {
        title: function() {
          return Vue.$t('page.about.title');
        }
      }),
      computedProperties({
        viewAs: 'favorite',
        additionalActions: []
      }, {
        title: function() {
          return Vue.$t('page.favorite.title');
        }
      }),
      computedProperties({
        viewAs: 'personal',
        additionalActions: []
      }, {
        title: function() {
          return Vue.$t('page.personal.title');
        }
      }),
      computedProperties({
        viewAs: 'datasets',
        additionalActions: []
      }, {
        title: function() {
          return Vue.$t('page.datasets.title');
        }
      }),
      computedProperties({
        viewAs: 'settings',
        additionalActions: []
      }, {
        title: function() {
          return Vue.$t('page.settings.title');
        }
      })
    ];
  },

  createDatasetExplorer: function(state, datasetRef) {
    var exists = !!_.find(state.pages, {
      viewAs: 'explorer',
      itemRef: datasetRef
    });
    if (!exists) {
      var dataset = storage.getItemByRef(datasetRef);
      state.pages.push({
        viewAs: 'explorer',
        title: dataset.title,
        itemRef: dataset.$ref,
        additionalActions: [
          {
            title: Vue.$t('ui.download'), icon: 'download',
            action: 'downloadDataset', argument: datasetRef
          },
          {
            title: Vue.$t('ui.addToFavorites'), icon: 'heart',
            action: 'toggleFavorites', argument: datasetRef
          }
        ],
        pagination: null
      });
    }
  },
  updateDatasetExplorer: function(state, datasetRef) {
    var page = _.find(state.pages, {
      viewAs: 'explorer',
      itemRef: datasetRef
    });
    if (page) {
      var dataset = storage.getItemByRef(datasetRef);
      var items = _.isArray(dataset.items) ? dataset.items : [];
      var itemsPerPage = 20;
      page.pagination = {
        itemsPerPage: itemsPerPage,
        pageCount: Math.ceil(items.length / itemsPerPage),
        currentPage: 1
      };
    }
  },

  createTartanEditor: function(state, tartanRef) {
    var tartan = storage.getItemByRef(tartanRef);
    state.pages.push({
      viewAs: 'editor',
      title: tartan.name,
      itemRef: tartan.$ref,
      additionalActions: [
        {
          title: Vue.$t('ui.download'), icon: 'download',
          action: 'downloadTartan', argument: tartanRef
        },
        {
          title: Vue.$t('ui.addToFavorites'), icon: 'heart',
          action: 'toggleFavorites', argument: tartanRef
        }
      ],
      state: {
        threadcount: tartan.sett,
        schema: 'extended',
        repeat: true
      }
    });
  },
  setTartanPreview: function(state, data) {
    state.tartanPreview = _.extend({}, data);
  }
};

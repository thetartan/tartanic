'use strict';

var _ = require('lodash');
var Vue = require('vue');

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

  createDatasetExplorer: function(state, dataset) {
    var exists = !!_.find(state.pages, {
      viewAs: 'explorer',
      itemRef: dataset.$ref
    });
    if (!exists) {
      state.pages.push({
        viewAs: 'explorer',
        title: dataset.meta.title,
        itemRef: dataset.$ref,
        additionalActions: [
          {
            title: Vue.$t('ui.download'), icon: 'download',
            action: 'downloadItem', argument: dataset.$ref
          },
          {
            title: Vue.$t('ui.addToFavorites'), icon: 'heart',
            action: 'toggleFavorites', argument: dataset.$ref
          }
        ],
        pagination: null
      });
    }
  },
  updateDatasetExplorer: function(state, dataset) {
    var page = _.find(state.pages, {
      viewAs: 'explorer',
      itemRef: dataset.$ref
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
      itemRef: tartan.$ref,
      additionalActions: [
        {
          title: Vue.$t('ui.download'), icon: 'download',
          action: 'downloadItem', argument: tartan.$ref
        },
        {
          title: Vue.$t('ui.addToFavorites'), icon: 'heart',
          action: 'toggleFavorites', argument: tartan.$ref
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
  },
  setDownloadFiles: function(state, data) {
    state.downloadFiles = _.extend({}, data);
  }
};

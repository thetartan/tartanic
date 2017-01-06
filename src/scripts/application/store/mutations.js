'use strict';

var _ = require('lodash');
var Vue = require('vue');

module.exports = {
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
        itemRef: dataset.$ref,
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
};

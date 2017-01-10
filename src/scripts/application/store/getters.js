'use strict';

var _ = require('lodash');
var storage = require('./storage');

module.exports = {
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
      return storage.getItemByRef(currentPage.itemRef);
    }
    return null;
  }
};

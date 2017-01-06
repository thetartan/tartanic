'use strict';

var _ = require('lodash');

module.exports = {
  storage: _.constant(require('./storage')),
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
};

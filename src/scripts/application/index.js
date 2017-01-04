'use strict';

var _ = require('lodash');
var applicationService = require('../services/application');
var Vue = require('vue');
var Vuex = require('vuex');
var store = require('./store');

var configUrl = 'config.json';

function initializeApplication() {
  store.dispatch('viewPage', store.getters.pageDatasets);

  return applicationService.getConfig(configUrl)
    .then(function(config) {
      store.dispatch('setConfig', config);
      return applicationService.getDatasetDirectory(config.datasetDirectoryUrl);
    })
    .then(function(datasets) {
      store.dispatch('setDatasets', datasets);
    });
}

module.exports.run = function() {
  return initializeApplication().then(function() {
    return new Vue({
      el: '#application',
      template: require('./template.html'),
      store: store,
      data: {
        isSidebarMenuVisible: false
      },
      computed: _.extend({}, Vuex.mapState([
        'currentPage'
      ])),
      components: require('./components')
    });
  });
};

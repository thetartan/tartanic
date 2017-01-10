'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var applicationService = require('../services/application');
var Vue = require('vue');
var Vuex = require('vuex');
var store = require('./store');
var i18n = require('./i18n');

var configUrl = 'config.json';

function initializeApplication() {
  return applicationService.getConfig(configUrl)
    .then(function(config) {
      return Promise.all([
        applicationService.getDatasets(config.datasets),
        i18n.init(store, config)
      ]).then(function(results) {
        return _.first(results);
      });
    })
    .then(function(datasets) {
      store.dispatch('createDefaultPages');
      store.dispatch('setDatasets', datasets);
      store.dispatch('viewPage', store.getters.pageDatasets);
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

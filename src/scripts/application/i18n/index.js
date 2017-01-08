'use strict';

var _ = require('lodash');
var Vue = require('vue');
var VueI18nManager = require('vue-i18n-manager').default;

module.exports.init = function(store, config) {
  var userConfig = {};
  if (_.isString(config.defaultLanguage)) {
    userConfig.defaultCode = config.defaultLanguage;
  }
  if (_.isArray(config.availableLanguages)) {
    userConfig.languageFilter = _.filter(config.availableLanguages, _.isString);
  } else
  if (_.isString(config.availableLanguages)) {
    userConfig.languageFilter = [config.availableLanguages];
  }

  Vue.use(VueI18nManager, {
    store: store,
    config: _.extend(require('./@config.js'), userConfig)
  });
  Vue.$t = Vue.prototype.$t;
  return Vue.initI18nManager();
};

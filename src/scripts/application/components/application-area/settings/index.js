'use strict';

var _ = require('lodash');
var Vuex = require('vuex');
var i18nEvents = require('vue-i18n-manager').events;

module.exports = {
  template: require('./template.html'),
  computed: _.extend({}, Vuex.mapGetters([
    'availableLanguages',
    'currentLanguage'
  ])),
  methods: {
    changeLanguage: function(language) {
      this.$store.dispatch(i18nEvents.SET_LANGUAGE, language);
    }
  }
};

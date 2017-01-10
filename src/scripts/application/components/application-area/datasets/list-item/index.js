'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  props: ['item'],
  methods: _.extend({}, Vuex.mapActions([
    'viewDataset',
    'downloadDataset',
    'toggleFavorites'
  ])),
  computed: {
    licenseTitle: function() {
      if (_.isObject(this.item)) {
        var meta = this.item.meta;
        return _.isString(meta.license) ? meta.license : (
          _.get(meta, 'license.title') || _.get(meta, 'license.type')
        );
      }
    },
    licenseUrl: function() {
      return _.get(this.item.meta, 'license.url');
    }
  }
};

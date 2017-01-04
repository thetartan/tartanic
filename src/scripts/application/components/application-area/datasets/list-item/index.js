'use strict';

var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  props: ['item'],
  methods: _.extend({}, Vuex.mapActions([
    'viewDataset',
    'downloadDataset',
    'likeDataset'
  ])),
  computed: {
    licenseTitle: function() {
      if (_.isObject(this.item)) {
        return _.isString(this.item.license) ? this.item.license : (
          _.get(this.item, 'license.title') || _.get(this.item, 'license.type')
        );
      }
    },
    licenseUrl: function() {
      return _.get(this.item, 'license.url');
    }
  }
};

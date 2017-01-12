'use strict';

/* global window */

var _ = require('lodash');
var Vuex = require('vuex');
var utils = require('../../../../services/utils');

module.exports = {
  template: require('./template.html'),
  computed: _.extend({}, Vuex.mapState({
    'state': 'downloadFiles'
  })),
  methods: {
    downloadFile: function(file) {
      window.saveAs(new Blob([file.data], {
        type: 'application/octet-stream'
      }), file.name, true);
    },
    downloadFiles: function(files) {
      var archive = utils.createArchive(files);
      window.saveAs(archive, this.state.baseName + '.tar.gz', true);
    }
  }
};

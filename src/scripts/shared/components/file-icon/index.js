'use strict';

var path = require('path');
var prettyFileIcons = require('pretty-file-icons');

module.exports = {
  template: '<img v-bind:src="src">',
  props: ['filename', 'path', 'type'],
  computed: {
    src: function() {
      return path.join(this.path, prettyFileIcons.getIcon(
        this.filename, this.type));
    }
  }
};

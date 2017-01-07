'use strict';

module.exports = {
  template: '<i v-if="name" v-bind:class="iconClass"></i>',
  props: ['name', 'size'],
  computed: {
    iconClass: function() {
      var result = {fa: true};
      result['fa-' + this.name] = true;
      var size = parseInt(this.size, 10) || 0;
      if (size > 1) {
        result['fa-' + size + 'x'] = true;
      }
      return result;
    }
  }
};

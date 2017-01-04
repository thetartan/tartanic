'use strict';

module.exports = {
  template: require('./template.html'),
  props: ['count', 'value'],
  data: function() {
    return {
      currentValue: 1,
      currentCount: 1,
      isEditing: false,
      editingValue: null
    };
  },
  methods: {
    startEditing: function() {
      this.isEditing = true;
      this.editingValue = this.currentValue;
    },
    confirmEditing: function() {
      this.isEditing = false;
      this.updateValue(this.editingValue);
    },
    cancelEditing: function() {
      this.isEditing = false;
    },
    updateState: function() {
      var count = parseInt(this.count, 10) || 0;
      if (count < 1) {
        count = 1;
      }
      this.currentCount = count;

      var value = parseInt(this.value, 10) || 0;
      if (value < 1) {
        value = 1;
      }
      if (value > this.currentCount) {
        value = this.currentCount;
      }
      if (value != this.currentValue) {
        this.currentValue = value;
        this.$emit('input', value);
      }
    },
    updateValue: function(value) {
      value = parseInt(value, 10) || 0;
      if (value < 1) {
        value = 1;
      }
      if (value > this.currentCount) {
        value = this.currentCount;
      }
      if (value != this.currentValue) {
        this.currentValue = value;
        this.$emit('input', value);
      }
    }
  },
  mounted: function() {
    this.updateState();
  },
  watch: {
    value: function() {
      this.updateState();
    },
    count: function() {
      this.updateState();
    }
  }
};

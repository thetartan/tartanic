'use strict';

var $ = require('jquery');
var _ = require('lodash');
var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  props: ['value'],
  data: function() {
    return {
      isDatabasesMenuExpanded: false,
      isEditorsMenuExpanded: false
    };
  },
  computed: _.extend({
    explorersChevronClass: function() {
      return {
        'fa-caret-right': !this.isDatabasesMenuExpanded,
        'fa-caret-down': this.isDatabasesMenuExpanded
      };
    },
    editorsChevronClass: function() {
      return {
        'fa-caret-right': !this.isEditorsMenuExpanded,
        'fa-caret-down': this.isEditorsMenuExpanded
      };
    }
  }, Vuex.mapGetters([
    'pageHome',
    'pageAbout',
    'pageFavorite',
    'pagePersonal',
    'pageDatasets',
    'explorers',
    'editors'
  ]), Vuex.mapState([
    'datasetsCount'
  ])),
  methods: _.extend({
    slideDown: function(element, done) {
      $(element).hide().slideDown('fast', done);
    },
    slideUp: function(element, done) {
      $(element).slideUp('fast', done);
    },
    toggleExplorersMenu: function() {
      this.isDatabasesMenuExpanded = !this.isDatabasesMenuExpanded;
    },
    toggleEditorsMenu: function() {
      this.isEditorsMenuExpanded = !this.isEditorsMenuExpanded;
    },
    viewPage: function(page) {
      this.$store.dispatch('viewPage', page);
      $(this.$refs.menu).sidebar('hide');
    }
  }),
  watch: {
    value: function(value) {
      $(this.$refs.menu).sidebar(value ? 'show' : 'hide');
    }
  },
  mounted: function() {
    var that = this;
    $(that.$refs.menu).sidebar({
      context: that.$refs.menu.parentNode,
      defaultTransition: {
        computer: {
          left: 'overlay',
          right: 'overlay',
          top: 'overlay',
          bottom: 'overlay'
        },
        mobile: {
          left: 'overlay',
          right: 'overlay',
          top: 'overlay',
          bottom: 'overlay'
        }
      },
      onShow: function() {
        that.$emit('input', true);
      },
      onHidden: function() {
        that.$emit('input', false);
      }
    });
  }
};

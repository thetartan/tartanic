'use strict';

module.exports = {
  currentPage: null,
  itemState: {},
  datasetsCount: 0,
  tartanPreview: {
    isVisible: false
  },
  pages: [
    {
      viewAs: 'home',
      title: 'Home',
      additionalActions: []
    },
    {
      viewAs: 'about',
      title: 'About this project',
      additionalActions: []
    },
    {
      viewAs: 'favorite',
      title: 'Favorite tartans',
      additionalActions: []
    },
    {
      viewAs: 'personal',
      title: 'My tartans',
      additionalActions: []
    },
    {
      viewAs: 'datasets',
      title: 'All datasets',
      additionalActions: []
    }
  ]
};

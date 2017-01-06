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
      title: 'Home'
    },
    {
      viewAs: 'about',
      title: 'About this project'
    },
    {
      viewAs: 'favorite',
      title: 'Favorite tartans'
    },
    {
      viewAs: 'personal',
      title: 'My tartans'
    },
    {
      viewAs: 'datasets',
      title: 'All datasets'
    }
  ]
};

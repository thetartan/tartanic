'use strict';

var _ = require('lodash');

_.extend(
  module.exports,
  require('./resize'),
  {
    supports: require('./supports')
  }
);

'use strict';

/* global window */

var _ = require('lodash');
var jquery = require('jquery');

// Initialize tartan library and its plugins
require('tartan');
require('tartan-processing');
require('tartan-render');
require('tartan-schema');
require('tartan-fingerprint');
require('identartan');

// Init some global variables - needed for proper work of 3rd-party libraries
window._ = _;

window.jQuery = window.$ = jquery;

require('semantic-ui-css/semantic');

// fetch() polyfill
require('isomorphic-fetch/fetch-npm-browserify');
// saveAs() polyfill
window.saveAs = require('file-saver/FileSaver.js').saveAs;

window.tartan = require('tartan');

if (typeof window.Promise != 'function') {
  window.Promise = require('bluebird');
}

require('./shared');

jquery(function() {
  var application = require('./application');
  application.run();
});

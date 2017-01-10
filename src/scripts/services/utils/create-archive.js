'use strict';

/* global Blob */

var tar = require('tinytar').tar;
var gzip = require('pako').gzip;

function createArchive(files) {
  var bytes = gzip(tar(files));
  return new Blob([bytes], {
    type: 'application/gzip'
  });
}

module.exports = createArchive;

'use strict';

module.exports = {
  template: '<div>' + [
    '<tartan-preview-modal></tartan-preview-modal>',
    '<download-files-modal></download-files-modal>'
  ].join('') + '</div>',
  components: {
    tartanPreviewModal: require('./tartan-preview-modal'),
    downloadFilesModal: require('./download-files-modal')
  }
};

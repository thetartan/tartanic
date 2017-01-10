'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var translationsPath = path.join(__dirname, '/../../../translations');

module.exports = {
  persistent: true,
  storageKey: 'vueI18nManager.languageCode',
  path: 'public/i18n',
  defaultCode: 'en',
  languageFilter: [],
  languages: _.chain(fs.readdirSync(translationsPath))
    .map(function(filename) {
      var contents = require(path.join(translationsPath, filename));
      filename = path.parse(filename);
      if (filename.ext == '.json') {
        return _.extend({}, _.get(contents, '@'), {
          code: filename.name,
          urlPrefix: filename.name,
          translateTo: filename.name
        });
      }
    })
    .filter()
    .value()
};

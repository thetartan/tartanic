'use strict';

var path = require('path');

var unknownExtension = 'file.svg';

var knownExtensions = {
  '.ai': 'ai.svg',
  '.avi': 'avi.svg',
  '.css': 'css.svg',
  '.csv': 'csv.svg',
  '.dbf': 'dbf.svg',
  '.doc': 'doc.svg',
  '.dwg': 'dwg.svg',
  '.exe': 'exe.svg',
  '.fla': 'fla.svg',
  '.html': 'html.svg',
  '.iso': 'iso.svg',
  '.jpg': 'jpg.svg',
  '.json': 'json.svg',
  '.js': 'js.svg',
  '.mp3': 'mp3.svg',
  '.mp4': 'mp4.svg',
  '.pdf': 'pdf.svg',
  '.png': 'png.svg',
  '.ppt': 'ppt.svg',
  '.psd': 'psd.svg',
  '.rtf': 'rtf.svg',
  '.svg': 'svg.svg',
  '.txt': 'txt.svg',
  '.xls': 'xls.svg',
  '.xml': 'xml.svg',
  '.zip': 'zip.svg',
  // common icon for some archive types
  '.gz': 'archive.svg',
  '.7z': 'archive.svg'
};

function isString(value) {
  return (typeof value === 'string') ||
    (Object.prototype.toString.call(value) == '[object String]');
}

module.exports = function(value, prefix) {
  if (!isString(value)) {
    return value;
  }
  if (!isString(prefix)) {
    prefix = '';
  }
  value = path.extname(value).toLowerCase();
  return prefix + (knownExtensions[value] || unknownExtension);
};

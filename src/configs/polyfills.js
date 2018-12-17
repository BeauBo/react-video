
if (typeof Promise === 'undefined') {
  window.Promise = require('promise/lib/es6-extensions.js'); // eslint-disable-line global-require
}

require('core-js/es6/map');
require('core-js/es6/set');
require('whatwg-fetch');

Object.assign = require('object-assign');

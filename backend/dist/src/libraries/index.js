'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require('./passport.lib');

Object.defineProperty(exports, 'createPassportLibrary', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_passport).default;
  }
});

var _sendgrid = require('./sendgrid.lib');

Object.defineProperty(exports, 'createSendgridLibrary', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_sendgrid).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map
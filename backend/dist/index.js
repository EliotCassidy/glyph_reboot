'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _src = require('./src');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_src).default;
  }
});
Object.keys(_src).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _src[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map
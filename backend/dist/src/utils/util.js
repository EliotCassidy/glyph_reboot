'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UtilService = undefined;

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UtilService {
  constructor({
    log = (0, _bunyan2.default)({})
  } = {}) {
    this.log = log.child({ service: 'pdn-util-service' });
  }

  notEmpty(value) {
    return !_validator2.default.isEmpty(value);
  }
}

exports.UtilService = UtilService;

exports.default = options => new UtilService(options);
//# sourceMappingURL=util.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorResolver = undefined;

var _bunyan = require("bunyan");

var _bunyan2 = _interopRequireDefault(_bunyan);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ErrorResolver {
  constructor({ log = (0, _bunyan2.default)({ name: "Death Node API", noop: true }) } = {}) {
    this.log = log.child({ service: "pdn-util-service" });
  }

  formatValidationError(error) {
    const errors = [];
    const message = error.message;

    if (error.name !== "ValidationError") {
      return error;
    }

    Object.keys(error.errors).forEach(field => {
      const errorMessage = _util2.default.format(error.errors[field].message);
      errors.push(errorMessage);
    });

    return { errors, message };
  }
}

exports.ErrorResolver = ErrorResolver;

exports.default = options => new ErrorResolver(options);
//# sourceMappingURL=error-resolver.util.js.map
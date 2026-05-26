'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthMiddleware = undefined;

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _boom = require('boom');

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AuthMiddleware {
  constructor({
    secret,
    userService,
    passportLib,
    reqId = (0, _uuid2.default)(),
    log = (0, _bunyan2.default)({ noop: true })
  } = {}) {
    this.log = log.child({ service: 'auth-middleware', reqId });
    this.secret = secret;
    this.userService = userService;

    // initialize passport strategies
    passportLib.setupStrategies();
  }

  isAuthenticated() {
    return async (req, res, next) => {
      try {
        const { user } = await this.userService.validateToken(req.headers.authorization);
        if (user) {
          req.user = user;

          // update last login
          await this.userService.updateUser({
            userId: user._id,
            updates: { lastLogin: Date.now() }
          });

          next();
        } else {
          throw (0, _boom.unauthorized)('Unauthorized! invalid token');
        }
      } catch (error) {
        this.log.error(error);
        next(error);
      }
    };
  }

  isAdmin() {
    return async (req, res, next) => {
      try {
        this.isAuthenticated()(req, res, err => {
          if (err) return next(err);

          if (req.user.role.toLowerCase() === 'admin') {
            next();
          } else {
            next((0, _boom.forbidden)('You are not authorized to access this route'));
          }
        });
      } catch (error) {
        this.log.error(error);
        next(error);
      }
    };
  }
}

exports.AuthMiddleware = AuthMiddleware;

exports.default = options => new AuthMiddleware(options);
//# sourceMappingURL=auth.js.map
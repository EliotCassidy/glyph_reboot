'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PassportUtil = undefined;

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Passport Strategies
const LocalStrategy = _passportLocal2.default.Strategy;

class PassportUtil {
  constructor({
    userService,
    log = _bunyan2.default.bunyan({ noop: true })
  } = {}) {
    this.userService = userService;
    this.log = log.child({ service: 'passport-service' });
  }

  async localAuth(email, password, done) {
    try {
      // const searchUser = await Promise.all([
      //   this.userService.getByEmailForAuth(userNameOrEmail),
      //   this.userService.getByUsernameForAuth(userNameOrEmail)
      // ])

      // const [user] = searchUser.filter(x => x !== null)

      const user = await this.userService.getByEmailForAuth(email);

      if (!user) {
        return done(null, false, {
          status_code: 401,
          message: 'Incorrect login credentials',
          description: 'Check email or password and try again'
        });
      }

      const isUserAuthenticated = user.authenticate(password);
      return isUserAuthenticated ? done(null, user) : done(null, false, {
        status_code: 401,
        message: 'Incorrect login credentials',
        description: 'Check email or password and try again'
      });
    } catch (err) {
      this.log.error(err);
      done(err);
    }
  }

  setupStrategies() {
    // setup local
    _passport2.default.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (username, password, done) => this.localAuth(username, password, done)));
  }
}

exports.PassportUtil = PassportUtil;

exports.default = options => new PassportUtil(options);
//# sourceMappingURL=passport.lib.js.map
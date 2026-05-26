'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ({
  userService,
  log = (0, _bunyan2.default)({ noop: true })
}) => {
  const router = (0, _express.Router)({ mergeParams: true });
  router.use(_bodyParser2.default.json());

  router.post('/local', async (req, res, next) => {
    try {
      _passport2.default.authenticate('local', (err, user, info) => {
        const error = err || info;

        if (error) {
          return res.status(401).json(error);
        }
        if (!user) {
          return res.status(404).json({
            message: 'missing user data',
            description: 'Something went wrong, please try again.'
          });
        }
        const token = userService.createToken(user);

        res.json(_extends({}, token));
      })(req, res, next);
    } catch (e) {
      log.error(e);
      next(e);
    }
  });
  return router;
};
//# sourceMappingURL=auth.js.map
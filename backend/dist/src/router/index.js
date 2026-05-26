'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _express = require('express');

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _scripts = require('./scripts');

var _scripts2 = _interopRequireDefault(_scripts);

var _rules = require('./rules');

var _rules2 = _interopRequireDefault(_rules);

var _download = require('./download');

var _download2 = _interopRequireDefault(_download);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ({
  userService,
  scriptsService,
  rulesService,
  downloadService,
  authMiddleware,
  log = (0, _bunyan2.default)({ noop: true })
}) => {
  const router = (0, _express.Router)({ mergeParams: true });

  router.use('/auth', (0, _auth2.default)({
    userService,
    authMiddleware,
    log: log.child({ router: 'auth' })
  }));

  router.use('/users', (0, _user2.default)({
    userService,
    authMiddleware,
    log: log.child({ router: 'users' })
  }));

  router.use('/scripts', (0, _scripts2.default)({
    scriptsService,
    authMiddleware,
    log: log.child({ router: 'scripts' })
  }));

  router.use('/rules', (0, _rules2.default)({
    rulesService,
    authMiddleware,
    log: log.child({ router: 'rules' })
  }));

  router.use('/download', (0, _download2.default)({
    downloadService,
    authMiddleware,
    log: log.child({ router: 'download' })
  }));

  return router;
};
//# sourceMappingURL=index.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _db = require('./db');

var _services = require('./services');

var _middleware = require('./middleware');

var _libraries = require('./libraries');

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ({
  favicon = _path2.default.resolve(__dirname, '..', 'favicon.ico'),
  log = (0, _bunyan2.default)({ name: 'Glyph API', noop: true }),
  pkg = {},
  secret,
  dbConfig,
  ruleConfig,
  adminUser,
  sendgridConfig,
  webBaseUrl,
  apiBase
} = {}) => {
  const app = (0, _express2.default)();
  if (!secret) throw new Error('App Secret Missing!!!');
  if (_ramda2.default.isNil(ruleConfig.bonusPointsPercentage) || _ramda2.default.isNil(ruleConfig.minPercentageVariance) || _ramda2.default.isNil(ruleConfig.minRuleCount)) {
    throw new Error('Rule missing, which is required !!!');
  }

  // Initialize database
  const dbService = (0, _db.createDbService)({ log, dbConfig, adminUser, ScriptsModel: _db.ScriptsModel, UserModel: _db.UserModel });
  dbService.init();

  // Provision dependencies
  const emailService = (0, _libraries.createSendgridLibrary)({ log, sendgridConfig });

  const userService = (0, _services.createUserService)({
    secret,
    apiBase,
    webBaseUrl,
    UserModel: _db.UserModel,
    RulesModel: _db.RulesModel,
    emailService,
    log,
    PasswordResetToken: _db.PasswordResetToken
  });

  const downloadService = (0, _services.createDownloadService)({ log, RulesModel: _db.RulesModel, UserModel: _db.UserModel, ScriptsModel: _db.ScriptsModel });

  const rulesService = (0, _services.createRulesService)({ RulesModel: _db.RulesModel, ruleConfig, log });
  const scriptsService = (0, _services.createScriptsService)({ ScriptsModel: _db.ScriptsModel, RulesModel: _db.RulesModel, log });

  const passportLib = (0, _libraries.createPassportLibrary)({ userService, log });
  const authMiddleware = (0, _middleware.createAuthMiddleware)({ userService, passportLib, secret, log });

  const router = (0, _router2.default)({
    authMiddleware,
    userService,
    rulesService,
    scriptsService,
    downloadService,
    log
  });

  app.use((0, _cors2.default)());
  app.get('/', (req, res, next) => {
    res.json({
      'Server Name': 'Glyph API Server',
      'Version': pkg.version
    });
  });
  app.use((0, _serveFavicon2.default)(favicon));
  app.use('/api/v1', router);

  const onStart = async () => {
    log.info('On Start: App Started !');
  };

  return {
    server: app,
    onStart
  };
};
//# sourceMappingURL=server.js.map
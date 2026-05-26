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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ({
  rulesService,
  authMiddleware,
  log = (0, _bunyan2.default)({ noop: true })
}) => {
  const router = (0, _express.Router)({ mergeParams: true });
  router.use(_bodyParser2.default.json());

  router.get('/all', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const rules = await rulesService.getAllRules();
      res.json({ rules });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.get('/', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const filter = _extends({}, req.query.scriptId && { script: req.query.scriptId });
      const userId = req.user._id;
      const rules = await rulesService.getRulesForUser({ userId, filter });

      res.json({ rules });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.get('/:ruleId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { ruleId } = req.params;
      const rule = await rulesService.getById({ ruleId, userId });

      res.json({ rule });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.post('/', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { scriptId, ruleBinary, description } = req.body;

      const ruleData = {
        ruleBinary,
        description,
        script: scriptId,
        "user": userId
      };

      const createdRule = await rulesService.createRule(ruleData);

      res.json({ createdRule });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.patch('/:ruleId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { ruleId } = req.params;
      const { ruleBinary, description } = req.body;

      const updates = _extends({}, ruleBinary && { ruleBinary }, description && { description });

      const rule = await rulesService.updateRule({ ruleId, userId, updates });
      res.json({ rule });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.post('/test/:ruleId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { ruleId } = req.params;
      const { testBinary } = req.body;

      const rule = await rulesService.testRule({ userId, ruleId, testBinary });
      res.json({ rule });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.post('/forfeit/:ruleId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { ruleId } = req.params;

      const rule = await rulesService.forfeitRule({ userId, ruleId });
      res.json({ rule });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.delete('/:ruleId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { ruleId } = req.params;

      const deletedRule = await rulesService.deleteRule({ ruleId, userId });
      res.json({ deletedRule });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  return router;
};
//# sourceMappingURL=rules.js.map
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

var _boom = require('boom');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ({
  scriptsService,
  authMiddleware,
  log = (0, _bunyan2.default)({ noop: true })
}) => {
  const router = (0, _express.Router)({ mergeParams: true });
  router.use(_bodyParser2.default.json());

  router.get('/all', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      const scripts = await scriptsService.getAllScripts();
      res.json({ scripts });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.get('/', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id;
      const scripts = await scriptsService.getActiveScripts({ userId });
      res.json({ scripts });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.get('/:scriptId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const { scriptId } = req.params;
      const script = await scriptsService.getById(scriptId);

      res.json({ script });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.post('/', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      const newScriptData = req.body;
      const createdScript = await scriptsService.createScript(newScriptData);

      res.json({ createdScript });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.patch('/:scriptId', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      const { scriptId } = req.params;
      const { name, enabled, isoNumber, isoCode, family, ancestor, scriptType, place, pointsToUnlock, unicode, utf_8, html } = req.body;

      const hasKey = key => _ramda2.default.has(key, req.body) && !_ramda2.default.isNil(_ramda2.default.prop(key, req.body));

      const updates = _extends({}, hasKey('name') && { name }, hasKey('enabled') && { enabled }, hasKey('isoNumber') && { isoNumber }, hasKey('isoCode') && { isoCode }, hasKey('family') && { family }, hasKey('ancestor') && { ancestor }, hasKey('scriptType') && { scriptType }, hasKey('place') && { place }, hasKey('pointsToUnlock') && { pointsToUnlock }, hasKey('unicode') && { unicode }, hasKey('utf_8') && { utf_8 }, hasKey('html') && { html });

      if (_ramda2.default.isEmpty(Object.keys(updates))) {
        throw (0, _boom.badRequest)('no updates found in payload');
      }

      const updatedScript = await scriptsService.updateScript({
        scriptId,
        updates
      });
      res.json({ updatedScript });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.delete('/:scriptId', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      const { scriptId } = req.params;

      const deletedScript = await scriptsService.deleteScript({ scriptId });
      res.json({ deletedScript });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  return router;
};
//# sourceMappingURL=scripts.js.map
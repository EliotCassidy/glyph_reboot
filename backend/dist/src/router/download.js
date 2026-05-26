'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fastCsv = require('fast-csv');

var csv = _interopRequireWildcard(_fastCsv);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ({
  downloadService,
  authMiddleware,
  log = (0, _bunyan2.default)({ noop: true })
}) => {
  const router = (0, _express.Router)({ mergeParams: true });
  router.use(_bodyParser2.default.json());

  router.get('/users', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'application/force-download');
      res.setHeader('Content-disposition', 'attachment;filename=users-data.csv');

      const csvStream = csv.format({ headers: true });
      csvStream.pipe(res).on('end', () => res.end());

      await downloadService.exportUserData({ csvStream });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.get('/scripts', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'application/force-download');
      res.setHeader('Content-disposition', 'attachment;filename=scripts-data.csv');

      const csvStream = csv.format({ headers: true });
      csvStream.pipe(res).on('end', () => res.end());

      await downloadService.exportScriptsData({ csvStream });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.get('/rules', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'application/force-download');
      res.setHeader('Content-disposition', 'attachment;filename=rules-data.csv');

      const csvStream = csv.format({ headers: true });
      csvStream.pipe(res).on('end', () => res.end());

      await downloadService.exportRulesData({ csvStream });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  router.get('/rules/:scriptId', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'application/force-download');
      res.setHeader('Content-disposition', 'attachment;filename=script-rules-data.csv');

      const { scriptId } = req.params;

      const csvStream = csv.format({ headers: true });
      csvStream.pipe(res).on('end', () => res.end());

      await downloadService.exportRulesForScript({ csvStream, scriptId });
    } catch (e) {
      log.error(e);
      next(e);
    }
  });

  return router;
};
//# sourceMappingURL=download.js.map
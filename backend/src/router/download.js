import { Router } from 'express'
import bodyParser from 'body-parser'
import * as csv from 'fast-csv';
import bunyan from 'bunyan'

export default ({
  downloadService,
  authMiddleware,
  log = bunyan({ noop: true })
}) => {
  const router = Router({ mergeParams: true })
  router.use(bodyParser.json())

  router.get('/users', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'application/force-download');
      res.setHeader('Content-disposition', 'attachment;filename=users-data.csv');

      const csvStream = csv.format({ headers: true });
      csvStream.pipe(res).on('end', () => res.end());

      await downloadService.exportUserData({ csvStream })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.get('/scripts', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'application/force-download');
      res.setHeader('Content-disposition', 'attachment;filename=scripts-data.csv');

      const csvStream = csv.format({ headers: true });
      csvStream.pipe(res).on('end', () => res.end());

      await downloadService.exportScriptsData({ csvStream })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.get('/rules', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'application/force-download');
      res.setHeader('Content-disposition', 'attachment;filename=rules-data.csv');

      const csvStream = csv.format({ headers: true });
      csvStream.pipe(res).on('end', () => res.end());

      await downloadService.exportRulesData({ csvStream })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.get('/rules/:scriptId', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      res.setHeader('Content-Type', 'application/force-download');
      res.setHeader('Content-disposition', 'attachment;filename=script-rules-data.csv');

      const { scriptId } = req.params

      const csvStream = csv.format({ headers: true });
      csvStream.pipe(res).on('end', () => res.end());

      await downloadService.exportRulesForScript({ csvStream, scriptId })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  return router
}

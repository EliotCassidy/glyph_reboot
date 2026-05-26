import { Router } from 'express'
import bodyParser from 'body-parser'
import bunyan from 'bunyan'
import { badRequest } from 'boom'

import R from 'ramda'

export default ({
  scriptsService,
  authMiddleware,
  log = bunyan({ noop: true })
}) => {
  const router = Router({ mergeParams: true })
  router.use(bodyParser.json())

  router.get('/all', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      const scripts = await scriptsService.getAllScripts ()
      res.json({ scripts })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.get('/', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id
      const scripts = await scriptsService.getActiveScripts({ userId })
      res.json({ scripts })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.get('/:scriptId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const { scriptId } = req.params
      const script = await scriptsService.getById(scriptId)

      res.json({ script })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.post('/', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      const newScriptData = req.body
      const createdScript = await scriptsService.createScript(newScriptData)

      res.json({ createdScript })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.patch('/:scriptId', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      const { scriptId } = req.params
      const { name, enabled, isoNumber, isoCode, family, ancestor, scriptType, place, pointsToUnlock, unicode, utf_8, html } = req.body

      const hasKey = key => R.has(key, req.body) && !R.isNil(R.prop(key, req.body))

      const updates = {
        ...(hasKey('name') && { name }),
        ...(hasKey('enabled') && { enabled }),
        ...(hasKey('isoNumber') && { isoNumber }),
        ...(hasKey('isoCode') && { isoCode }),
        ...(hasKey('family') && { family }),
        ...(hasKey('ancestor') && { ancestor }),
        ...(hasKey('scriptType') && { scriptType }),
        ...(hasKey('place') && { place }),
        ...(hasKey('pointsToUnlock') && { pointsToUnlock }),
        ...(hasKey('unicode') && { unicode }),
        ...(hasKey('utf_8') && { utf_8 }),
        ...(hasKey('html') && { html })
      }

      if (R.isEmpty(Object.keys(updates))) {
        throw badRequest('no updates found in payload')
      }

      const updatedScript = await scriptsService.updateScript({
        scriptId,
        updates
      })
      res.json({ updatedScript })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.delete('/:scriptId', authMiddleware.isAdmin(), async (req, res, next) => {
    try {
      const { scriptId } = req.params

      const deletedScript = await scriptsService.deleteScript({ scriptId })
      res.json({ deletedScript })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  return router
}

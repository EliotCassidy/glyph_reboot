import { Router } from 'express'
import bodyParser from 'body-parser'
import bunyan from 'bunyan'


export default ({
  rulesService,
  authMiddleware,
  log = bunyan({ noop: true })
}) => {
  const router = Router({ mergeParams: true })
  router.use(bodyParser.json())

  router.get('/public/:ruleId', async (req, res, next) => {
    try {
      const { ruleId } = req.params
      const rule = await rulesService.getPublicById({ ruleId })

      res.json({ rule })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.get('/all', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const rules = await rulesService.getAllRules ()
      res.json({ rules })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.get('/', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const filter = {
        ...(req.query.scriptId && { script: req.query.scriptId })
      }
      const userId = req.user._id
      const rules = await rulesService.getRulesForUser({ userId, filter })

      res.json({ rules })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.get('/:ruleId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id
      const { ruleId } = req.params
      const rule = await rulesService.getById({ ruleId, userId })

      res.json({ rule })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.post('/', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id
      const { scriptId, ruleBinary, description } = req.body

      const ruleData = {
        ruleBinary,
        description,
        script: scriptId,
        "user": userId
      }

      const createdRule = await rulesService.createRule(ruleData)

      res.json({ createdRule })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.patch('/:ruleId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id
      const { ruleId } = req.params
      const { ruleBinary, description } = req.body

      const updates = {
        ...(ruleBinary && { ruleBinary }),
        ...(description && { description })
      }

      const rule = await rulesService.updateRule({ ruleId, userId, updates })
      res.json({ rule })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.post('/test/:ruleId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id
      const { ruleId } = req.params
      const { testBinary } = req.body

      const rule = await rulesService.testRule({ userId, ruleId, testBinary })
      res.json({ rule })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.post('/forfeit/:ruleId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id
      const { ruleId } = req.params

      const rule = await rulesService.forfeitRule({ userId, ruleId })
      res.json({ rule })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.delete('/:ruleId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    try {
      const userId = req.user._id
      const { ruleId } = req.params

      const deletedRule = await rulesService.deleteRule({ ruleId, userId })
      res.json({ deletedRule })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  return router
}

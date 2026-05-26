import { Router } from 'express'
import bodyParser from 'body-parser'
import bunyan from 'bunyan'
import { unauthorized } from 'boom'

export default ({
  userService,
  authMiddleware,
  log = bunyan({ noop: true })
}) => {
  const router = Router({ mergeParams: true })
  router.use(bodyParser.json())

  router.get('/', authMiddleware.isAdmin(), async (req, res, next) => {
    log.debug('', { method: req.method, path: req.originalUrl, query: req.query, params: req.params })

    try {
      const users = await userService.getAllUsers()
      res.json({ users })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.get('/leaderboard', authMiddleware.isAuthenticated(), async (req, res, next) => {
    log.debug('', { method: req.method, path: req.originalUrl, query: req.query, params: req.params })

    try {
      const userId = req.user._id

      const limit = Number(req.query.limit)
        ? Number(req.query.limit)
        : undefined
      ;

      const leaderboardData = await userService.getLeaderboard({ userId, limit })
      res.json(leaderboardData)
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.get('/:userId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    log.debug('', { method: req.method, path: req.originalUrl, query: req.query, params: req.params })

    try {
      const { userId } = req.params

      if (userId !== req.user._id) {
        throw unauthorized('you are not authorized to access this user')
      }

      const user = await userService.getById(userId)

      res.json({ user })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.post('/', async (req, res, next) => {
    log.debug('', { method: req.method, path: req.originalUrl, query: req.query, params: req.params })

    try {
      const newUserData = req.body

      delete newUserData.role
      delete newUserData.createdAt
      delete newUserData.updatedAt
      delete newUserData.salt
      delete newUserData.totalPoints
      delete newUserData.lastLogin

      const token = await userService.createUser(newUserData)

      res.json({ ...token })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.patch('/:userId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    log.debug('', { method: req.method, path: req.originalUrl, query: req.query, params: req.params })

    try {
      const userId = req.user._id

      if (userId !== req.params.userId) {
        throw unauthorized('You are not authorized to update this user')
      }

      const updates = req.body

      const user = await userService.updateUser({ userId, updates })
      res.json({ user })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.delete('/:userId', authMiddleware.isAuthenticated(), async (req, res, next) => {
    log.debug('', { method: req.method, path: req.originalUrl, query: req.query, params: req.params })

    try {
      const { userId } = req.params
      const _userId = req.user._id

      if (userId !== _userId) {
        throw unauthorized('You can only terminate your own account!')
      }

      const deletedUser = await userService.terminateAccount({ userId })
      res.json({ deletedUser })
    } catch (e) {
      log.error(e)
      next(e)
    }
  })

  router.post('/password/forgot', async (req, res, next) => {
    log.debug('', { method: req.method, path: req.originalUrl, query: req.query, params: req.params })

    try {
      const { email } = req.body;
      await userService.forgotPassword({ email })

      res.status(204).end()
    } catch (e) {
      log.error(e)
      next(e)
    }
  });

  router.patch('/password/change', authMiddleware.isAuthenticated(), async (req, res, next) => {
    log.debug('', { method: req.method, path: req.originalUrl, query: req.query, params: req.params })

    try {
      const { _id: userId } = req.user
      const { oldPassword, newPassword } = req.body;
      await userService.changePassword({ userId, oldPassword, newPassword })

      res.status(204).end()
    } catch (e) {
      log.error(e)
      next(e)
    }
  });

  router.post('/password/reset', async (req, res, next) => {
    log.debug('', { method: req.method, path: req.originalUrl, query: req.query, params: req.params })

    try {
      const { token, newPassword } = req.body;
      await userService.resetPassword({ token, newPassword })

      res.status(204).end()
    } catch (e) {
      log.error(e)
      next(e)
    }
  });

  return router
}

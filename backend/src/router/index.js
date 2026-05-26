import bunyan from 'bunyan';
import { Router } from 'express';

import createAuthRouter from './auth';
import createUserRouter from './user';
import createScriptsRouter from './scripts';
import createRulesRouter from './rules';
import createDownloadRouter from './download'


export default ({
  userService,
  scriptsService,
  rulesService,
  downloadService,
  authMiddleware,
  log = bunyan({ noop: true })
}) => {
  const router = Router({ mergeParams: true })

  router.use('/auth', createAuthRouter({
    userService,
    authMiddleware,
    log: log.child({ router: 'auth' })
  }))

  router.use('/users', createUserRouter({
    userService,
    authMiddleware,
    log: log.child({ router: 'users' })
  }))

  router.use('/scripts', createScriptsRouter({
    scriptsService,
    authMiddleware,
    log: log.child({ router: 'scripts' })
  }))

  router.use('/rules', createRulesRouter({
    rulesService,
    authMiddleware,
    log: log.child({ router: 'rules' })
  }))

  router.use('/download', createDownloadRouter({
    downloadService,
    authMiddleware,
    log: log.child({ router: 'download' })
  }))

  return router
}

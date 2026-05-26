import path from 'path'
import cors from 'cors'
import R from 'ramda'

import express from 'express'
import serveFavicon from 'serve-favicon'
import bunyan from 'bunyan'

import {
  createDbService,
  ScriptsModel,
  RulesModel,
  UserModel,
  PasswordResetToken
  // migration
} from './db'

import {
  createUserService,
  createRulesService,
  createScriptsService,
  createDownloadService
} from './services'

import {
  createAuthMiddleware
} from './middleware'

import {
  createPassportLibrary,
  createSendgridLibrary
} from './libraries'

import createRouter from './router'

export default ({
  favicon = path.resolve(__dirname, '..', 'favicon.ico'),
  log = bunyan({ name: 'Glyph API', noop: true }),
  pkg = {},
  secret,
  dbConfig,
  ruleConfig,
  adminUser,
  sendgridConfig,
  webBaseUrl,
  apiBase
} = {}) => {
  const app = express()
  if (!secret) throw new Error('App Secret Missing!!!')
  if (
    R.isNil(ruleConfig.bonusPointsPercentage) ||
    R.isNil(ruleConfig.minPercentageVariance) ||
    R.isNil(ruleConfig.minRuleCount)) {
    throw new Error('Rule missing, which is required !!!')
  }

  // Initialize database
  const dbService = createDbService({ log, dbConfig, adminUser, ScriptsModel, UserModel })
  dbService.init()

  // Provision dependencies
  const emailService = createSendgridLibrary({ log, sendgridConfig })

  const userService = createUserService({
    secret,
    apiBase,
    webBaseUrl,
    UserModel,
    RulesModel,
    emailService,
    log,
    PasswordResetToken
  })

  const downloadService = createDownloadService({ log, RulesModel, UserModel, ScriptsModel })

  const rulesService = createRulesService({ RulesModel, ruleConfig, log })
  const scriptsService = createScriptsService({ ScriptsModel, RulesModel, log })

  const passportLib = createPassportLibrary({ userService, log })
  const authMiddleware = createAuthMiddleware({ userService, passportLib, secret, log })

  const router = createRouter({
    authMiddleware,
    userService,
    rulesService,
    scriptsService,
    downloadService,
    log
  });

  app.use(cors())
  app.get('/', (req, res, next) => {
    res.json({
      'Server Name': 'Glyph API Server',
      'Version': pkg.version
    })
  })
  app.use(serveFavicon(favicon))
  app.use('/api/v1', router)

  const onStart = async () => {
    log.info('On Start: App Started !')
  }

  return {
    server: app,
    onStart
  }
}

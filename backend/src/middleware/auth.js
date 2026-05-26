import bunyan from 'bunyan'
import { forbidden, unauthorized } from 'boom'
import uuid from 'uuid'

export class AuthMiddleware {
  constructor({
    secret,
    userService,
    passportLib,
    reqId = uuid(),
    log = bunyan({ noop: true })
  } = {}) {
    this.log = log.child({ service: 'auth-middleware', reqId })
    this.secret = secret
    this.userService = userService

    // initialize passport strategies
    passportLib.setupStrategies()
  }

  isAuthenticated() {
    return async (req, res, next) => {
      try {
        const { user } = await this.userService.validateToken(req.headers.authorization)
        if (user) {
          req.user = user

          // update last login
          await this.userService.updateUser({
            userId: user._id,
            updates: { lastLogin: Date.now() }
          })

          next()
        } else {
          throw unauthorized('Unauthorized! invalid token')
        }
      } catch (error) {
        this.log.error(error)
        next(error)
      }
    }
  }

  isAdmin() {
    return async (req, res, next) => {
      try {
        this.isAuthenticated()(req, res, err => {
          if (err) return next(err)

          if (req.user.role.toLowerCase() === 'admin') {
            next()
          } else {
            next(forbidden('You are not authorized to access this route'))
          }
        })
      } catch (error) {
        this.log.error(error)
        next(error)
      }
    }
  }
}

export default options => new AuthMiddleware(options)

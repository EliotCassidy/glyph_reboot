import R from 'ramda'
import uuid from 'uuid'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

import fs from 'fs';
import path from 'path';

import {
  createErrorResolver
} from '../utils'

import bunyan from 'bunyan'
import {
  badRequest,
  boomify,
  unauthorized,
  notFound
} from 'boom'

import crypto from 'crypto'

const { ValidationError } = mongoose.Error
const errorResolver = createErrorResolver({})

export class UserService {
  constructor({
    secret,
    apiBase,
    webBaseUrl,
    UserModel,
    RulesModel,
    emailService,
    PasswordResetToken,
    reqId = uuid(),
    log = bunyan({ noop: true })
  } = {}) {
    this.secret = secret
    this.apiBase = apiBase
    this.webBaseUrl = webBaseUrl

    this.UserModel = UserModel
    this.RulesModel = RulesModel

    this.emailService = emailService
    this.PasswordResetToken = PasswordResetToken

    this.RESET_TOKEN_VALIDITY = 1 // 1 day

    // 1 day   = 60 * 60 * 24 = 86, 400 seconds
    // 1 week  = 86400 * 7    = 604, 800 seconds
    // 1 month = 604800 * 4   = 2,419,200 seconds
    this.tokenExpiryDurations = {
      day: (n = 1) => (n <= 0) ? 86400 : 86400 * n,
      week: (n = 1) => (n <= 0) ? 604800 : 604800 * n,
      month: (n = 1) => (n <= 0) ? 2419200 : 2419200 * n
    }

    this.log = log.child({ service: 'user-service', reqId })
  }

  async getAllUsers() {
    try {
      const users = await this.UserModel.find()
      const scoredUsers = []

      for (let user of users) {
        user.totalPoints = await this.RulesModel.aggregateScore(user._id)
        scoredUsers.push(user)
      }
      return scoredUsers
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async getLeaderboard({ userId, limit = 10 }) {
    try {
      const { username } = await this.getById(userId)

      const leaderboard = await this.UserModel.aggregate([
        { $lookup: { from: 'rules', localField: '_id', foreignField: 'user', as: 'rules' }},
        { $unwind: { path: '$rules', preserveNullAndEmptyArrays: true }},
        {
          $project: {
            username: 1,
            rules: { points: 1, status: 1, isUnique: 1 },
            countUniqueRules: {
              $cond: [{ $eq: ["$rules.isUnique", true] }, 1, 0]
            }
          }
        },
        { $group: { _id: '$username', totalPoints: { '$sum': '$rules.points' }, uniqueRuleCount: { $sum: '$countUniqueRules' }}},
        { $project: { _id: 0, username: '$_id', totalPoints: 1, uniqueRuleCount: 1 }},

        { $sort: { 'totalPoints': -1 }}
      ])

      const userStats = await this.RulesModel.getRuleStatsForUser(userId)

      userStats.position = R.findIndex(R.propEq('username', username), leaderboard) + 1

      return {
        userStats,
        leaderboard: leaderboard.slice(0, limit)
      }
    } catch (ex) {
      this.log.info(ex)
      throw ex
    }
  }

  async _getLeaderboard({ userId }) {
    try {
      const users = await this.UserModel.find()
      const leaderboard = []

      for (let user of users) {
        const { totalPoints, uniqueRuleCount } = await this.RulesModel.getRuleStatsForUser(user._id)
        leaderboard.push({
          totalPoints,
          uniqueRuleCount,
          username: user.username
        })
      }
      return R.sort((a, b) => b.totalPoints - a.totalPoints, leaderboard)
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async getByUsername(username) {
    try {
      return await this.UserModel.findOne({ username })
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async getByEmail(email) {
    try {
      return await this.UserModel.findOne({ email })
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async getUserAndToken(token) {
    this.log.info('get user by password reset token', { token })

    try {
      const passwordToken = await this.PasswordResetToken.findOne({ token })

      if (passwordToken === null) {
        throw notFound(`token ${token} was not found, cannot retrieve user`)
      }
      const user = await this.getById(passwordToken.user)

      return { user, passwordToken }
    } catch (e) {
      throw boomify(e)
    }
  }

  async getByUsernameForAuth(username) {
    try {
      return await this.UserModel
        .findOne({ username })
        .select('+password')
        .select('+salt')
      ;
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async getByEmailForAuth(email) {
    try {
      let escapedEmail = null;

      if (email.indexOf('+') > -1) {
        const parts = email.split('+');
        escapedEmail = `${parts[0]}\\+${parts[1]}`;
      }
      const user = await this.UserModel
        .findOne({ 'email': new RegExp(`^${escapedEmail || email}$`, 'i') })
        .select('+password')
        .select('+salt')
      ;

      return user;
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async getById(userId) {
    try {
      const user = await this.UserModel.findOne({ _id: userId })

      if (user === null) {
        throw notFound(`user with id ${userId} was not found`)
      }
      user.totalPoints = await this.RulesModel.aggregateScore(userId)

      return user
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async updateUser({ userId, updates }) {
    try {
      delete updates.role
      delete updates.createdAt
      delete updates.updatedAt
      delete updates.salt
      delete updates.resetPasswordToken
      delete updates.totalPoints
      delete updates.lastLogin

      delete updates.password
      delete updates.email

      const user = await this.getById(userId)

      for (const [field, value] of Object.entries(updates)) {
        user[field] = value
      }
      user.updatedAt = new Date()

      return await user.save()
    } catch (e) {
      this.log.error(e)

      if (e instanceof ValidationError) {
        const { message, errors } = errorResolver.formatValidationError(e)
        throw badRequest(message, errors)
      }
      throw boomify(e)
    }
  }

  async createUser(userData) {
    try {
      const newUser = new this.UserModel(userData)
      newUser.provider = 'local'
      const savedUser = await newUser.save()

      return this.createToken(savedUser)
    } catch (e) {
      this.log.error(e)

      if (e instanceof ValidationError) {
        const { message, errors } = errorResolver.formatValidationError(e)
        throw badRequest(message, errors)
      }
      throw boomify(e)
    }
  }

  async terminateAccount({ userId }) {
    try {
      return await this.UserModel.findByIdAndRemove(userId)
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  createToken(user) {
    const tNow = Math.floor(Date.now() / 1000)
    const tokenExpiryDate = Math.floor(tNow) + this.tokenExpiryDurations.month(3)

    // Get token data defined in model's virtual field
    const tokenData = user.token

    const sanitizedUser = R.pick(
      ['email', 'username', 'role', '_id'],
      user
    )

    const payload = JSON.stringify({
      iat: tNow,
      nbf: tNow,
      exp: tokenExpiryDate,
      ...tokenData
    })

    try {
      const token = jwt.sign(payload, this.secret)

      return {
        user: sanitizedUser,
        tokenExpiryDate,
        token
      }
    } catch (e) {
      this.log.error(e)
      throw boomify(e)
    }
  }

  async validateToken(token) {
    try {
      const user = jwt.verify(token, this.secret)

      return {
        user,
        token
      }
    } catch (e) {
      this.log.error(e)
      throw unauthorized(e)
    }
  }


  async forgotPassword({ email }) {
    this.log.info('forgot password', { email })

    try {
      const template = fs.readFileSync(path.join(__dirname, '../templates/password-reset.html'))
      const user = await this.getByEmail(email)

      if (R.isNil(user)) {
        return
      }

      const buffer = crypto.randomBytes(35)
      const token = buffer.toString('hex')

      const expireAt = new Date()
      expireAt.setDate(expireAt.getDate() + this.RESET_TOKEN_VALIDITY)

      const passwordResetToken = new this.PasswordResetToken({
        token,
        expireAt,
        user: user._id
      })

      await passwordResetToken.save();

      const reset_password_url = `${ this.webBaseUrl }\/reset\/${token}`
      const inflated_template = template.toString().replaceAll(
        '{{reset_password_url}}',
        reset_password_url
      )

      await this.emailService.sendEmail({
        recipient: user.email,
        subject: 'Reset your Glyph account password',
        content: inflated_template
      })
    } catch (e) {
      throw boomify(e)
    }
  }

  async resetPassword({ token, newPassword }) {
    this.log.info('reset password', { token: '*****', newPassword: '*****' })

    try {
      const { user, passwordToken } = await this.getUserAndToken(token)
      user.password = newPassword;

      await user.save();
      await passwordToken.remove();
    } catch (e) {
      throw boomify(e)
    }
  }

  async changePassword({ userId, oldPassword, newPassword }) {
    this.log.info('change password', { userId, oldPassword: '*****', newPassword: '*****' })

    try {
      const user = await this.UserModel
        .findOne({ _id: userId })
        .select('+password')
        .select('+salt')
        ;

      if (user === null) {
        throw notFound(`user with id ${userId} was not found`)
      }

      if (user.authenticate(oldPassword)) {
        user.password = newPassword;
        await user.save()
      } else {
        throw badRequest('incorrect password')
      }
    } catch (e) {
      throw boomify(e)
    }
  }
}

export default options => new UserService(options)

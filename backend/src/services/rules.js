import uuid from 'uuid'

import bunyan from 'bunyan'
import { notFound, badRequest } from 'boom'
import mongoose from 'mongoose'

import {
  createErrorResolver
} from '../utils'


const { ValidationError } = mongoose.Error
const errorResolver = createErrorResolver({})

export class RulesService {
  constructor({
    RulesModel,
    ruleConfig,
    reqId = uuid(),
    log = bunyan({ noop: true })
  } = {}) {
    this.BONUS_POINTS_PERCENTAGE = ruleConfig.bonusPointsPercentage
    this.MIN_PERCENTAGE_VARIANCE = ruleConfig.minPercentageVariance

    this.RulesModel = RulesModel
    this.log = log.child({ service: 'script-service', reqId })
  }


  async getAllRules() {
    try {
      return await this.RulesModel
        .find()
        .populate('user', 'username email')
        .exec()
      ;
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }


  async getRulesForUser({ userId, filter }) {
    try {
      return await this.RulesModel
        .find({ user: userId, ...filter })
        .populate('user', 'username email')
        .exec()
      ;
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }


  async getById({ userId, ruleId }) {
    this.log.info('get by id', { userId, ruleId })
    try {
      const rule = await this.RulesModel
        .findOne({ _id: ruleId, user: userId })
        .populate('user', 'username email')
        .exec()
      ;

      if (rule === null) {
        throw notFound(`rule with id ${ruleId} was not found`)
      }
      return rule
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }


  async getPublicById({ ruleId }) {
    this.log.info('get public by id', { ruleId })
    try {
      const rule = await this.RulesModel
        .findById(ruleId)
        .populate('user', 'username')
        .populate('script', 'name html')
        .exec()
      ;

      if (rule === null || rule.remainingAttempts > 0) {
        throw notFound(`rule with id ${ruleId} was not found`)
      }

      return rule
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }


  async testRule({ userId, ruleId, testBinary }) {
    try {
      const rule = await this.getById({ userId, ruleId })

      if (rule.isTested()) {
        throw badRequest('rule has already been tested')
      }
      const updates = {
        remainingAttempts: rule.remainingAttempts - 1,
        points: 0,
      }

      const { match, points } = rule.getScoreValue(testBinary)

      if (match) {
        // award bonus points if rule is unique
        const minVariance = this.MIN_PERCENTAGE_VARIANCE * rule.ruleBinary.length
        updates.isUnique = await this.RulesModel.isUnique({ rule, minVariance })

        updates.points = (updates.isUnique === true)
          ? points + Math.ceil(this.BONUS_POINTS_PERCENTAGE * points)
          : points
        ;

        updates.remainingAttempts = 0
      }

      return await this.RulesModel.findByIdAndUpdate(ruleId, updates, {
        new: true,
        timestamps: false,
      })
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async forfeitRule({ userId, ruleId }) {
    try {
      const rule = await this.getById({ userId, ruleId })

      if (rule.isTested()) {
        throw badRequest('rule has already been tested')
      }

      const updates = { remainingAttempts: 0 }

      return await this.RulesModel.findByIdAndUpdate(ruleId, updates, {
        new: true
      })
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async createRule(ruleData) {
    try {
      const newRule = new this.RulesModel(ruleData)
      const savedRule = await newRule.save()

      const ruleId = savedRule._id.toString()
      const userId = ruleData.user

      return await this.getById({ ruleId, userId })
    } catch (e) {
      if (e instanceof ValidationError) {
        const { message, errors } = errorResolver.formatValidationError(e)
        throw badRequest(message, errors)
      }
      if (e.code === 11000) {
        throw badRequest('rule already exists')
      }

      this.log.error(e)
      throw e
    }
  }

  async updateRule({ ruleId, userId, updates }) {
    try {
      // ensure user owns rule, throw 404 otherwise
      const rule = await this.getById({ userId, ruleId })

      if (rule.isTested()) {
        throw badRequest('cannot update tested rule')
      }

      const { description, ruleBinary } = updates

      if (description) rule.description = description
      if (ruleBinary) rule.ruleBinary = ruleBinary

      rule.updatedAt = new Date()
      return await rule.save()
    } catch (e) {
      this.log.info(e)

      if (e instanceof ValidationError) {
        const { message, errors } = errorResolver.formatValidationError(e)
        throw badRequest(message, errors)
      }

      if (e.code === 11000) {
        throw badRequest('rule already exists')
      }
      throw e
    }
  }


  async deleteRule({ ruleId, userId }) {
    try {
      // this will also ensure user owns rule, throw 404 otherwise
      const { remainingAttempts } = await this.getById({ userId, ruleId })

      if (remainingAttempts === 0) {
        // cannot delete rule that has already been tested
        throw badRequest('only untested rules can be deleted')
      } else {
        return await this.RulesModel.findByIdAndRemove(ruleId)
      }
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }
}

export default options => new RulesService(options)

import uuid from 'uuid'
import R from 'ramda'
import bunyan from 'bunyan'
import { badRequest, notFound } from 'boom'
import mongoose from 'mongoose'


const { ValidationError } = mongoose.Error

export class ScriptsService {
  constructor({
    RulesModel,
    ScriptsModel,
    reqId = uuid(),
    log = bunyan({ noop: true })
  } = {}) {
    this.RulesModel = RulesModel
    this.ScriptsModel = ScriptsModel
    this.log = log.child({ service: 'script-service', reqId })
  }

  async getAllScripts() {
    try {
      return await this.ScriptsModel.find()
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async getActiveScripts({ userId }) {
    this.log.info('Get active scripts for user', { userId })

    try {
      const scripts = await this.ScriptsModel.find({ enabled: true })
      this.log.info('enabled script count:', scripts.length)

      const enrichedScripts = []

      for (let script of scripts) {
        const rules = await this.RulesModel
          .find({ user: userId, script: script._id })
          .populate('user', 'username email')
          .sort({ points: -1 })
          .exec()
        ;

        let totalPoints = 0
        let playCount = 0

        for (let rule of rules) {
          if (rule.remainingAttempts === 0) {
            playCount++
            totalPoints += rule.points
          }
        }

        enrichedScripts.push({
          playCount,
          totalPoints,
          rules,
          ...script._doc
        })
      }

       return R.sort((a, b) => R.isEmpty(b.rules) ? -1 : 1, enrichedScripts)
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async getById(scriptId) {
    try {
      const script = await this.ScriptsModel.findOne({ _id: scriptId })

      if (script === null) {
        throw notFound(`script with id ${scriptId} was not found`)
      }
      return script
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async updateScript({ scriptId, updates }) {
    try {
      this.log.info('updates:', { updates })

      if (R.isNil(updates.enabled)) {
        throw badRequest('enabled must be either true or false')
      }

      return await this.ScriptsModel.findByIdAndUpdate(scriptId, updates, {
        new: true
      })
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async createScript(scriptData) {
    try {
      const newScript = new this.ScriptsModel(scriptData)
      return await newScript.save()
    } catch (e) {
      this.log.error(e)
      if (e instanceof ValidationError) {
        throw badRequest('Script with the same isoNumber alrady exists')
      } else {
        throw boomify(e)
      }
    }
  }

  async deleteScript({ scriptId }) {
    try {
      return await this.ScriptsModel.findByIdAndRemove(scriptId)
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }
}

export default options => new ScriptsService(options)

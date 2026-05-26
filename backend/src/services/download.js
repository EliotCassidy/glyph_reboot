import uuid from 'uuid'
import R from 'ramda'
import bunyan from 'bunyan'
import { notFound } from 'boom'

function getRuleStatus(rule) {
  if (rule.remainingAttempts === 3) return 'unplayed'
  if (rule.remainingAttempts > 0) return 'pending'
  if (rule.points > 0) return 'passed'

  return 'failed'
}

export class DownloadService {
  constructor({
    RulesModel,
    UserModel,
    ScriptsModel,
    reqId = uuid(),
    log = bunyan({ noop: true })
  } = {}) {
    this.ScriptsModel = ScriptsModel
    this.RulesModel = RulesModel
    this.UserModel = UserModel

    this.log = log.child({ service: 'download-service', reqId })
  }

  async exportUserData({ csvStream }) {
    this.log.info('Export user data')

    try {
      const users = await this.UserModel.find()

      for (let user of users) {
        const totalPoints = await this.RulesModel.aggregateScore(user._id)

        csvStream.write({
          ID: user._id,
          Username: user.username,
          Email: user.email,
          Age: user.age,
          Gender: user.gender,
          'Points Achieved': totalPoints,
          'First Language': user.firstLanguage,
          'Native Language': user.nativeLanguage,
          'Spoken Languages': user.spokenLanguages,
          'Spoken Languages Literacy': user.spokenLanguagesLiteracy,
          'Last Login': user.lastLogin,
          Created: user.createdAt.toUTCString()
        });
      }
      csvStream.end()
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async exportScriptsData({ csvStream }) {
    this.log.info('Export scripts data')

    try {
      const scripts = await this.ScriptsModel.find()

      for (let script of scripts) {
        csvStream.write({
          ID: script._id,
          Name: script.name,
          Characters: script.unicode,
          Place: script.place,
          Ancestor: script.ancestor,
          Family: script.family,
          Type: script.scriptType
        });
      }
      csvStream.end()
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  /**
   * Legacy code
   * @param {*} obj
   * @returns
   */
  getMethods(obj) {
    let result = [];
    for (var id in obj) {
      try {
        if (typeof (obj[id]) == "function") {
          result.push(id + ": " + obj[id].toString());
        }
      } catch (err) {
        result.push(id + ": inaccessible");
      }
    }
    return result;
  }

  async exportRulesData({ csvStream }) {
    this.log.info('Export rules data')

    try {
      const rules = await this.RulesModel.find()

      for (let rule of rules) {
        csvStream.write({
          ID: rule._id,
          Description: rule.description,
          'Rule Binary': rule.ruleBinary,
          'Unique': rule.isUnique,
          Status: getRuleStatus(rule),
          'Tries Left': rule.remainingAttempts,
          'Points Earned': rule.points,
          'Script ID': rule.script,
          'User ID': rule.user,
          Created: rule.createdAt.toUTCString()
        });
      }
      csvStream.end()
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async exportRulesForScript({ csvStream, scriptId }) {
    this.log.info('Export rules data for script:', { scriptId })

    try {
      const rules = await this.RulesModel.find({ script: scriptId })
      const { unicode } = await this.ScriptsModel.findOne({ _id: scriptId })

      if (!unicode) throw notFound('Could not find unicode characters for this script')

      for (let x = 0; x < unicode.length; x++) {
        const character = unicode[x]
        const row = { 'Character': character }

        for (let { ruleBinary, _id } of rules) {
          row[_id] = ruleBinary[x]
        }
        csvStream.write(row);
      }
      csvStream.end()
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  /**
   * Legacy code
   * @param {*} param0
   */
  async _exportRulesForScript({ csvStream, scriptId }) {
    this.log.info('Export rules data for script:', { scriptId })

    try {
      const rules = await this.RulesModel.find()

      for (let rule of rules) {
        const { html } = await this.ScriptsModel.findOne({ _id: scriptId })

        const row = { 'Rule ID': rule._id }
        const { ruleBinary } = rule

        for (let x = 0; x < ruleBinary.length; x++) {
          const character = html[x]
          const binary = ruleBinary[x]

          row[character] = binary
        }

        csvStream.write(row);
      }
      csvStream.end()
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

}

export default options => new DownloadService(options)

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScriptsService = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _boom = require('boom');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { ValidationError } = _mongoose2.default.Error;

class ScriptsService {
  constructor({
    RulesModel,
    ScriptsModel,
    reqId = (0, _uuid2.default)(),
    log = (0, _bunyan2.default)({ noop: true })
  } = {}) {
    this.RulesModel = RulesModel;
    this.ScriptsModel = ScriptsModel;
    this.log = log.child({ service: 'script-service', reqId });
  }

  async getAllScripts() {
    try {
      return await this.ScriptsModel.find();
    } catch (e) {
      this.log.error(e);
      throw e;
    }
  }

  async getActiveScripts({ userId }) {
    this.log.info('Get active scripts for user', { userId });

    try {
      const scripts = await this.ScriptsModel.find({ enabled: true });
      this.log.info('enabled script count:', scripts.length);

      const enrichedScripts = [];

      for (let script of scripts) {
        const rules = await this.RulesModel.find({ user: userId, script: script._id }).populate('user', 'username email').sort({ points: -1 }).exec();

        let totalPoints = 0;
        let playCount = 0;

        for (let rule of rules) {
          if (rule.remainingAttempts === 0) {
            playCount++;
            totalPoints += rule.points;
          }
        }

        enrichedScripts.push(_extends({
          playCount,
          totalPoints,
          rules
        }, script._doc));
      }

      return _ramda2.default.sort((a, b) => _ramda2.default.isEmpty(b.rules) ? -1 : 1, enrichedScripts);
    } catch (e) {
      this.log.error(e);
      throw e;
    }
  }

  async getById(scriptId) {
    try {
      const script = await this.ScriptsModel.findOne({ _id: scriptId });

      if (script === null) {
        throw (0, _boom.notFound)(`script with id ${scriptId} was not found`);
      }
      return script;
    } catch (e) {
      this.log.error(e);
      throw e;
    }
  }

  async updateScript({ scriptId, updates }) {
    try {
      this.log.info('updates:', { updates });

      if (_ramda2.default.isNil(updates.enabled)) {
        throw (0, _boom.badRequest)('enabled must be either true or false');
      }

      return await this.ScriptsModel.findByIdAndUpdate(scriptId, updates, {
        new: true
      });
    } catch (e) {
      this.log.error(e);
      throw e;
    }
  }

  async createScript(scriptData) {
    try {
      const newScript = new this.ScriptsModel(scriptData);
      return await newScript.save();
    } catch (e) {
      this.log.error(e);
      if (e instanceof ValidationError) {
        throw (0, _boom.badRequest)('Script with the same isoNumber alrady exists');
      } else {
        throw boomify(e);
      }
    }
  }

  async deleteScript({ scriptId }) {
    try {
      return await this.ScriptsModel.findByIdAndRemove(scriptId);
    } catch (e) {
      this.log.error(e);
      throw e;
    }
  }
}

exports.ScriptsService = ScriptsService;

exports.default = options => new ScriptsService(options);
//# sourceMappingURL=scripts.js.map
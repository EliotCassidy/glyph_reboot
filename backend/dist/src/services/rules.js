'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RulesService = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _boom = require('boom');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { ValidationError } = _mongoose2.default.Error;
const errorResolver = (0, _utils.createErrorResolver)({});

class RulesService {
  constructor({
    RulesModel,
    ruleConfig,
    reqId = (0, _uuid2.default)(),
    log = (0, _bunyan2.default)({ noop: true })
  } = {}) {
    this.BONUS_POINTS_PERCENTAGE = ruleConfig.bonusPointsPercentage;
    this.MIN_PERCENTAGE_VARIANCE = ruleConfig.minPercentageVariance;

    this.RulesModel = RulesModel;
    this.log = log.child({ service: 'script-service', reqId });
  }

  async getAllRules() {
    try {
      return await this.RulesModel.find().populate('user', 'username email').exec();
    } catch (e) {
      this.log.error(e);
      throw e;
    }
  }

  async getRulesForUser({ userId, filter }) {
    try {
      return await this.RulesModel.find(_extends({ user: userId }, filter)).populate('user', 'username email').exec();
    } catch (e) {
      this.log.error(e);
      throw e;
    }
  }

  async getById({ userId, ruleId }) {
    this.log.info('get by id', { userId, ruleId });
    try {
      const rule = await this.RulesModel.findOne({ _id: ruleId, user: userId }).populate('user', 'username email').exec();

      if (rule === null) {
        throw (0, _boom.notFound)(`rule with id ${ruleId} was not found`);
      }
      return rule;
    } catch (e) {
      this.log.error(e);
      throw e;
    }
  }

  async testRule({ userId, ruleId, testBinary }) {
    try {
      const rule = await this.getById({ userId, ruleId });

      if (rule.isTested()) {
        throw (0, _boom.badRequest)('rule has already been tested');
      }
      const updates = {
        remainingAttempts: rule.remainingAttempts - 1,
        points: 0
      };

      const { match, points } = rule.getScoreValue(testBinary);

      if (match) {
        // award bonus points if rule is unique
        const minVariance = this.MIN_PERCENTAGE_VARIANCE * rule.ruleBinary.length;
        updates.isUnique = await this.RulesModel.isUnique({ rule, minVariance });

        updates.points = updates.isUnique === true ? points + Math.ceil(this.BONUS_POINTS_PERCENTAGE * points) : points;

        updates.remainingAttempts = 0;
      }

      return await this.RulesModel.findByIdAndUpdate(ruleId, updates, {
        new: true,
        timestamps: false
      });
    } catch (e) {
      this.log.error(e);
      throw e;
    }
  }

  async forfeitRule({ userId, ruleId }) {
    try {
      const rule = await this.getById({ userId, ruleId });

      if (rule.isTested()) {
        throw (0, _boom.badRequest)('rule has already been tested');
      }

      const updates = { remainingAttempts: 0 };

      return await this.RulesModel.findByIdAndUpdate(ruleId, updates, {
        new: true
      });
    } catch (e) {
      this.log.error(e);
      throw e;
    }
  }

  async createRule(ruleData) {
    try {
      const newRule = new this.RulesModel(ruleData);
      const savedRule = await newRule.save();

      const ruleId = savedRule._id.toString();
      const userId = ruleData.user;

      return await this.getById({ ruleId, userId });
    } catch (e) {
      if (e instanceof ValidationError) {
        const { message, errors } = errorResolver.formatValidationError(e);
        throw (0, _boom.badRequest)(message, errors);
      }
      if (e.code === 11000) {
        throw (0, _boom.badRequest)('rule already exists');
      }

      this.log.error(e);
      throw e;
    }
  }

  async updateRule({ ruleId, userId, updates }) {
    try {
      // ensure user owns rule, throw 404 otherwise
      const rule = await this.getById({ userId, ruleId });

      if (rule.isTested()) {
        throw (0, _boom.badRequest)('cannot update tested rule');
      }

      const { description, ruleBinary } = updates;

      if (description) rule.description = description;
      if (ruleBinary) rule.ruleBinary = ruleBinary;

      rule.updatedAt = new Date();
      return await rule.save();
    } catch (e) {
      this.log.info(e);

      if (e instanceof ValidationError) {
        const { message, errors } = errorResolver.formatValidationError(e);
        throw (0, _boom.badRequest)(message, errors);
      }

      if (e.code === 11000) {
        throw (0, _boom.badRequest)('rule already exists');
      }
      throw e;
    }
  }

  async deleteRule({ ruleId, userId }) {
    try {
      // this will also ensure user owns rule, throw 404 otherwise
      const { remainingAttempts } = await this.getById({ userId, ruleId });

      if (remainingAttempts === 0) {
        // cannot delete rule that has already been tested
        throw (0, _boom.badRequest)('only untested rules can be deleted');
      } else {
        return await this.RulesModel.findByIdAndRemove(ruleId);
      }
    } catch (e) {
      this.log.error(e);
      throw e;
    }
  }
}

exports.RulesService = RulesService;

exports.default = options => new RulesService(options);
//# sourceMappingURL=rules.js.map
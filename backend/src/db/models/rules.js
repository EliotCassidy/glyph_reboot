import mongoose from "mongoose";
import bunyan from "bunyan";

import { badRequest } from "boom";

import { ScriptsModel } from "../";

const logger = bunyan({ name: "Glyph API", noop: true });
const log = logger.child({ service: "rules-model" });

const RuleSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "description is required"],
      maxLength: [150, "description cannot be more than 150 characters"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    script: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Script",
      required: true,
    },

    ruleBinary: String,

    points: {
      type: Number,
      default: 0,
    },

    isUnique: {
      type: Boolean,
      default: false,
    },

    remainingAttempts: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

/**
 * Static Functions
 */
RuleSchema.statics = {
  aggregateScore: async function (userId) {
    log.info("aggregate score", { userId });

    try {
      const testedRules = await this.find({
        user: userId,
        remainingAttempts: 0,
      });
      return testedRules.reduce(
        (accumulator, currentValue) => accumulator + currentValue.points,
        0
      );
    } catch (ex) {
      log.error(ex);
      throw ex;
    }
  },

  getRuleStats: async function () {
    log.info("get rule stats");

    try {
      const testedRules = await this.find({ remainingAttempts: 0 });

      let totalPoints = 0;
      let uniqueRuleCount = 0;

      for (let rule of testedRules) {
        totalPoints += rule.points;
        if (rule.isUnique) {
          uniqueRuleCount++;
        }
      }
      return { totalPoints, uniqueRuleCount };
    } catch (ex) {
      log.error(ex);
      throw ex;
    }
  },

  getRuleStatsForUser: async function (userId) {
    log.info("get rule stats for user", { userId });

    try {
      const rules = await this.find({ user: userId });

      let totalPoints = 0;
      let uniqueRuleCount = 0;
      let testedRuleCount = 0;
      let passedRuleCount = 0;

      for (let rule of rules) {
        totalPoints += rule.points;

        if (rule.points > 0) passedRuleCount++;
        if (rule.isUnique) uniqueRuleCount++;
        if (rule.remainingAttempts === 0) testedRuleCount++;
      }
      return { totalPoints, uniqueRuleCount, testedRuleCount, passedRuleCount };
    } catch (ex) {
      log.error(ex);
      throw ex;
    }
  },

  _getVariance: function (binary1, binary2) {
    log.info("get variance", { binary1, binary2 });

    try {
      if (binary1.length !== binary2.length) {
        throw badRequest("Binary lengths do not match");
      }

      let variance = 0;
      for (let x = 0; x < binary1.length - 1; x++) {
        if (binary1.charAt(x) !== binary2.charAt(x)) {
          variance++;
        }
      }
      return variance;
    } catch (ex) {
      log.error(ex);
      throw ex;
    }
  },

  isUnique: async function ({ rule, minVariance }) {
    log.info("checking for uniqueness", { rule, minVariance });

    try {
      const existingRules = await this.find({
        script: rule.script,
        remainingAttempts: 0,
        ruleBinary: rule.ruleBinary,
        points: { $gt: 0 },
      });

      return existingRules.length <= 0;
    } catch (ex) {
      log.error(ex);
      throw ex;
    }
  },
};

/**
 * Methods
 */
RuleSchema.methods = {
  isTested: function () {
    return this.remainingAttempts === 0;
  },

  getScoreValue: function (testBinary) {
    try {
      return testBinary === this.ruleBinary
        ? { match: true, points: this.ruleBinary.split("1").length - 1 }
        : { match: false, points: 0 };
    } catch (ex) {
      log.error(e);
      throw e;
    }
  },

  /**
   * @deprecated
   * check if tested rules with same rule binaries exist
   *
   * @returns
   */
  __testedDuplicatesExist: async function () {
    try {
      log.info("searching for tested duplicates", {
        ruleBinary: this.ruleBinary,
        user: this.user,
      });
      const duplicates = await mongoose.model("Rules").find({
        ruleBinary: this.ruleBinary,
        user: this.user,
        remainingAttempts: 0,
      });

      log.info({ duplicates });

      return duplicates.length > 0;
    } catch (ex) {
      log.error(e);
      throw e;
    }
  },
};

RuleSchema.path("ruleBinary")
  .validate({
    validator: function (ruleBinary) {
      return new Promise(async (resolve, _) => {
        try {
          const script = await ScriptsModel.findOne({ _id: this.script });
          const scriptLength = script.unicode.length;

          log.info({ scriptLength, ruleLength: ruleBinary.length });

          scriptLength === ruleBinary.length ? resolve(true) : resolve(false);
        } catch (ex) {
          log.info("error in rule validate", { ex });
          resolve(false);
        }
      });
    },
    message: "Rule binary must match number of characters in script",
  })
  .validate({
    validator: function (ruleBinary) {
      const self = this;

      return new Promise(async (resolve, _) => {
        try {
          const duplicates = await mongoose.model("Rules").find({
            ruleBinary: this.ruleBinary,
            _id: { $ne: self._id },
            user: this.user,
            script: this.script,
          });

          log.info("duplicates", {
            duplicates,
            len: duplicates.length,
          });

          duplicates.length === 0 ? resolve(true) : resolve(false);
        } catch (ex) {
          log.info("error in rule validate", { ex });
          resolve(false);
        }
      });
    },
    message: "Rule already exists",
  });

RuleSchema.index({ user: 1 }, { background: true });

export default mongoose.model("Rules", RuleSchema);

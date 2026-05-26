'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ScriptSchema = new _mongoose2.default.Schema({
  name: {
    type: String,
    required: [true, 'script name is required'],
    minlength: [3, 'script name cannot be less than 3 characters']
  },

  unicode: [String],
  utf_8: [String],
  html: [String],

  isoCode: String,
  isoNumber: String,

  place: String,
  ancestor: String,
  family: String,
  scriptType: String,

  enabled: {
    type: Boolean,
    default: false
  },

  pointsToUnlock: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

/**
 * Methods
 */
ScriptSchema.methods = {};

// Validate username is not taken
ScriptSchema.path('isoNumber').validate({
  validator: function (isoNumber) {
    const self = this;

    return new Promise(async (resolve, _) => {
      const script = await self.constructor.findOne({ isoNumber });
      script === null ? resolve(true) : resolve(false);
    });
  },
  message: 'The specified script already exists'
});

ScriptSchema.index({ name: 1 }, { background: true });
ScriptSchema.index({ isoNumber: 1 }, { background: true });

exports.default = _mongoose2.default.model('Script', ScriptSchema);
//# sourceMappingURL=script.js.map
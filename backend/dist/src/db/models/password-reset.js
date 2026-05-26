'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PasswordResetTokenSchema = new _mongoose2.default.Schema({
  user: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expireAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

PasswordResetTokenSchema.index({ token: 1 }, { background: true });
PasswordResetTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

exports.default = _mongoose2.default.model('PasswordResetToken', PasswordResetTokenSchema);
//# sourceMappingURL=password-reset.js.map
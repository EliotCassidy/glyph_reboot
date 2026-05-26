'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MigrationSchema = new _mongoose2.default.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	}

}, { timestamps: true });

exports.default = _mongoose2.default.model('Migrations', MigrationSchema);
//# sourceMappingURL=migration.js.map
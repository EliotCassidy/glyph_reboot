'use strict';

var _ = require('..');

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = (0, _bunyan2.default)({ name: 'Glyph API', noop: true });
const log = logger.child({ service: 'migration file' });

module.exports = (() => ({
	async process() {
		try {
			const scripts = await _.ScriptsModel.find({ pointsToUnlock: { $exists: false } });

			const promises = [];
			for (const script of scripts) {
				promises.push(_.ScriptsModel.findByIdAndUpdate(script._id, { pointsToUnlock: 0 }));
			}

			log.info(`Running migrations for ${promises.length} records`);
			await Promise.all(promises);
		} catch (error) {
			log.error('An error occurred: ', error);
		}
	}
}))();
//# sourceMappingURL=2_add_property_level_scripts_collection.js.map
import { RulesModel } from '..';
import bunyan from 'bunyan'

const logger = bunyan({ name: 'Glyph API', noop: true })
const log = logger.child({ service: 'migration file' })

module.exports = (() => ({
	async process() {
		try {
			const rules = await RulesModel.find({ remainingAttempts: { $exists: false }});

			const promises = [];
			for (const rule of rules) {
        promises.push(RulesModel.findByIdAndUpdate(rule._id, { remainingAttempts: 3 }))
			}

      log.info(`Running migrations for ${promises.length} records`)
			await Promise.all(promises);
		} catch (error) {
			log.error('An error occurred: ', error);
		}
	}
}))();

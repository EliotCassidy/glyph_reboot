import { ScriptsModel } from '..';
import bunyan from 'bunyan'

const logger = bunyan({ name: 'Glyph API', noop: true })
const log = logger.child({ service: 'migration file' })

module.exports = (() => ({
	async process() {
		try {
			const scripts = await ScriptsModel.find({ pointsToUnlock: { $exists: false }});

			const promises = [];
			for (const script of scripts) {
        promises.push(ScriptsModel.findByIdAndUpdate(script._id, { pointsToUnlock: 0 }))
			}

      log.info(`Running migrations for ${promises.length} records`)
			await Promise.all(promises);
		} catch (error) {
			log.error('An error occurred: ', error);
		}
	}
}))();

import path from 'path';
import R from 'ramda'
import fs from 'fs';

import bunyan from 'bunyan'
import { MigrationModel } from '..';

const logger = bunyan({ name: 'Glyph API', noop: true })
const log = logger.child({ service: 'migrations' })

export default async () => {
  log.info('Running migrations ...')

  try {
    const availableMigrations = {};
    const oldMigrations = await MigrationModel.find().sort({ createdAt: -1 });

    fs.readdirSync(__dirname)
      .filter((file) => {
        return file.indexOf('.') !== 0 && file.slice(-3) === '.js' && file !== 'index.js'
      })
      .forEach((migrationName) => {
        availableMigrations[migrationName.slice(0, -3)] = migrationName;
      })
    ;

    oldMigrations.map(({ name }) => delete availableMigrations[name]);

    const migrations = Object.values(availableMigrations);

    for (let filename of migrations) {
      if (R.isNil(filename)) return

      const migration = require(path.join(__dirname, filename))
      await migration.process()
      log.info('Migrated', { filename })

      await MigrationModel.create({ name: filename.slice(0, -3) })
      log.info('Migration record created in database')
    }

    log.info('==== Done Running Migrations ==== ');
  } catch (error) {
    log.error(error);
  }
}

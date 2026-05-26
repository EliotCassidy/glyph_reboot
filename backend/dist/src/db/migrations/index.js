'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _ = require('..');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = (0, _bunyan2.default)({ name: 'Glyph API', noop: true });
const log = logger.child({ service: 'migrations' });

exports.default = async () => {
  log.info('Running migrations ...');

  try {
    const availableMigrations = {};
    const oldMigrations = await _.MigrationModel.find().sort({ createdAt: -1 });

    _fs2.default.readdirSync(__dirname).filter(file => {
      return file.indexOf('.') !== 0 && file.slice(-3) === '.js' && file !== 'index.js';
    }).forEach(migrationName => {
      availableMigrations[migrationName.slice(0, -3)] = migrationName;
    });

    oldMigrations.map(({ name }) => delete availableMigrations[name]);

    const migrations = Object.values(availableMigrations);

    for (let filename of migrations) {
      if (_ramda2.default.isNil(filename)) return;

      const migration = require(_path2.default.join(__dirname, filename));
      await migration.process();
      log.info('Migrated', { filename });

      await _.MigrationModel.create({ name: filename.slice(0, -3) });
      log.info('Migration record created in database');
    }

    log.info('==== Done Running Migrations ==== ');
  } catch (error) {
    log.error(error);
  }
};
//# sourceMappingURL=index.js.map
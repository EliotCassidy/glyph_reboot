'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatabaseService = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _migrations = require('./migrations');

var _migrations2 = _interopRequireDefault(_migrations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { ValidationError } = _mongoose2.default.Error;

class DatabaseService {
  constructor({
    dbConfig,
    adminUser,
    UserModel,
    ScriptsModel,
    log = (0, _bunyan2.default)({ noop: true })
  } = {}) {
    this.config = dbConfig;
    this.adminUser = adminUser;
    this.ScriptsModel = ScriptsModel;
    this.UserModel = UserModel;
    this.log = log.child({ service: 'database' });
  }

  async init() {
    this.log.info('Initializing database ...');

    try {
      // Handle mongoose deprecations
      _mongoose2.default.set('useUnifiedTopology', true);
      _mongoose2.default.set('useFindAndModify', false);
      _mongoose2.default.set('useNewUrlParser', true);
      _mongoose2.default.set('useCreateIndex', true);

      _mongoose2.default.Promise = Promise;

      _mongoose2.default.connection.on('error', error => {
        this.log.error('Error connecting to database, exiting ...', error);
        process.exit(1);
      });

      _mongoose2.default.connection.on('connected', async () => {
        this.log.info('Mongoose default connection open to', this.config.uri);

        await (0, _migrations2.default)();

        // create admin if not exist
        this.log.info('seeding admin user');
        await this.createAdmin();

        if (this.config.seedData) {
          this.log.info(`Seed database flag set to ${this.config.seedData}`);
          this.seedData({ dropScripts: this.config.dropScripts });
        }
      });

      _mongoose2.default.connection.on('disconnected', err => {
        this.log.info('Mongoose default connection disconnected, exiting ...', err);
        process.exit(1);
      });

      this.log.info('Connecting ............');
      await _mongoose2.default.connect(this.config.uri, _extends({}, this.config.options));
    } catch (ex) {
      this.log.error('error in db init, exiting ...', { ex });
      process.exit(1);
    }
  }

  async createAdmin() {
    // create default admin
    const { email, password, username } = this.adminUser;
    const adminExist = await this.UserModel.findOne({ email });

    if (adminExist) {
      this.log.info('Admin user already exists, skipping create');
    } else {
      this.log.info('Admin user not found, creating ...');

      if (_ramda2.default.isNil(email) || email === '') throw new Error('default admin email missing');
      if (_ramda2.default.isNil(password) || password === '') throw new Error('default admin password missing');
      if (_ramda2.default.isNil(username) || username === '') throw new Error('default admin username missing');

      const newUser = new this.UserModel(_extends({}, this.adminUser, {
        role: 'admin'
      }));
      newUser.provider = 'local';
      await newUser.save();
    }
  }

  async seedData({ dropScripts = false }) {
    this.log.info('Seed data called');

    let createCount = 0;
    let skipCount = 0;

    try {
      // seed scripts data
      const scriptList = require('./seeds/scripts.json').scripts;
      this.log.info(`Seeding ${scriptList.length} scripts to database`);

      if (dropScripts) {
        this.log.info('Dropping scripts collection and re-seeding');

        try {
          await this.ScriptsModel.collection.drop();
        } catch (dropException) {} // may throw if collection does not exist, fail silently
      }

      for (let scriptData of scriptList) {
        const newScript = new this.ScriptsModel(scriptData);

        try {
          await newScript.save();
          createCount++;
        } catch (ex) {
          if (ex instanceof ValidationError) {
            skipCount++;
          } else {
            throw boomify(ex);
          }
        }
      }
      this.log.info('Seed data complete');
      this.log.info(`Created ${createCount} new scripts`);
      this.log.info(`Skipped ${skipCount} scripts that already exist`);
    } catch (ex) {
      this.log.error('error seeding data, continue execution ...', { ex });
    }
  }
}

exports.DatabaseService = DatabaseService;

exports.default = options => new DatabaseService(options);
//# sourceMappingURL=init.js.map
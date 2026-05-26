import mongoose from 'mongoose'
import bunyan from 'bunyan'
import R from 'ramda'

import runMigrations from './migrations'


const { ValidationError } = mongoose.Error

export class DatabaseService {
  constructor({
    dbConfig,
    adminUser,
    UserModel,
    ScriptsModel,
    log = bunyan({ noop: true })
  } = {}) {
    this.config = dbConfig
    this.adminUser = adminUser
    this.ScriptsModel = ScriptsModel
    this.UserModel = UserModel
    this.log = log.child({ service: 'database' })
  }

  async init() {
    this.log.info('Initializing database ...')

    try {
      // Handle mongoose deprecations
      mongoose.set('useUnifiedTopology', true)
      mongoose.set('useFindAndModify', false)
      mongoose.set('useNewUrlParser', true)
      mongoose.set('useCreateIndex', true)

      mongoose.Promise = Promise

      mongoose.connection.on('error', error => {
        this.log.error('Error connecting to database, exiting ...', error)
        process.exit(1)
      })

      mongoose.connection.on('connected', async () => {
        this.log.info('Mongoose default connection open to', this.config.uri)

        await runMigrations()

        // create admin if not exist
        this.log.info('seeding admin user')
        await this.createAdmin()

        if (this.config.seedData) {
          this.log.info(`Seed database flag set to ${this.config.seedData}`)
          this.seedData({ dropScripts: this.config.dropScripts })
        }
      })

      mongoose.connection.on('disconnected', err => {
        this.log.info('Mongoose default connection disconnected, exiting ...', err)
        process.exit(1)
      })

      this.log.info('Connecting ............')
      await mongoose.connect(this.config.uri, { ...this.config.options })
    } catch (ex) {
      this.log.error('error in db init, exiting ...', { ex })
      process.exit(1)
    }
  }

  async createAdmin() {
    // create default admin
    const { email, password, username } = this.adminUser
    const adminExist = await this.UserModel.findOne({ email })

    if (adminExist) {
      this.log.info('Admin user already exists, skipping create')
    } else {
      this.log.info('Admin user not found, creating ...')

      if (R.isNil(email) || email === '') throw new Error('default admin email missing')
      if (R.isNil(password) || password === '') throw new Error('default admin password missing')
      if (R.isNil(username) || username === '') throw new Error('default admin username missing')

      const newUser = new this.UserModel({
        ...this.adminUser,
        role: 'admin'
      })
      newUser.provider = 'local'
      await newUser.save()
    }
  }

  async seedData({ dropScripts = false }) {
    this.log.info('Seed data called')

    let createCount = 0
    let skipCount = 0

    try {
      // seed scripts data
      const scriptList = require('./seeds/scripts.json').scripts
      this.log.info(`Seeding ${scriptList.length} scripts to database`)

      if (dropScripts) {
        this.log.info('Dropping scripts collection and re-seeding')

        try {
          await this.ScriptsModel.collection.drop()
        } catch (dropException) {} // may throw if collection does not exist, fail silently
      }

      for (let scriptData of scriptList) {
        const newScript = new this.ScriptsModel(scriptData)

        try {
          await newScript.save()
          createCount++
        } catch (ex) {
          if (ex instanceof ValidationError) {
            skipCount++
          } else {
            throw boomify(ex)
          }
        }
      }
      this.log.info('Seed data complete')
      this.log.info(`Created ${createCount} new scripts`)
      this.log.info(`Skipped ${skipCount} scripts that already exist`)
    } catch (ex) {
      this.log.error('error seeding data, continue execution ...', { ex })
    }
  }
}

export default options => new DatabaseService(options)

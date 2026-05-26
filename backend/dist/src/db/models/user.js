'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = (0, _bunyan2.default)({ name: 'Glyph API', noop: true });

const UserSchema = new _mongoose2.default.Schema({
	email: {
		type: String,
		required: [true, 'email is required'],
		minlength: [5, 'email is required']
	},
	username: {
		type: String,
		required: [true, 'username is required'],
		minlength: [3, 'username cannot be less than 3 characters']
	},

	password: {
		type: String,
		select: false,
		required: [true, 'password is required'],
		minlength: [4, 'password cannot be less than 4 characters']
	},

	firstLanguage: String,
	nativeLanguage: String,
	spokenLanguages: [String],
	spokenLanguagesLiteracy: [String],

	totalPoints: {
		type: Number,
		default: 0
	},

	age: Number,
	gender: String,

	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user'
	},

	lastLogin: {
		type: Date,
		default: Date.now
	},

	consentForm: {
		type: Boolean,
		default: false
	},

	salt: {
		type: String,
		select: false
	}

}, { timestamps: true });

/**
 * Methods
 */
UserSchema.methods = {
	/**
  * Authenticate - check if the passwords are the same
  *
  * @param {String} password
  * @param {Function} callback
  * @return {Boolean}
  * @api public
  */
	authenticate(password) {
		return this.password === this.encryptPassword(password);
	},

	/**
  * Make salt
  *
  * @param {Number} byteSize Optional salt byte size, default to 16
  * @return {String}
  * @api public
  */
	makeSalt(byteSize = 16) {
		return _crypto2.default.randomBytes(byteSize).toString('base64');
	},

	/**
  * Encrypt password
  *
  * @param {String} password
  * @return {String}
  * @api public
  */
	encryptPassword(password) {
		if (!password || !this.salt) {
			return null;
		}

		var defaultIterations = 10000;
		var defaultKeyLength = 64;
		var salt = Buffer.from(this.salt, 'base64');

		return _crypto2.default.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha512').toString('base64');
	}
};

// Public profile information
UserSchema.virtual('profile').get(function () {
	return {
		'username': this.username,
		'name': `${this.lastName}, ${this.firstName} ${this.otherNames}`,
		'address': this.address,
		'phone': this.phone
	};
});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual('token').get(function () {
	return {
		'_id': this._id,
		'role': this.role,
		'email': this.email,
		'username': this.username
	};
});

// Validate username is not taken
UserSchema.path('username').validate({
	validator: function (username) {
		const self = this;

		return new Promise(async (resolve, _) => {
			if (!self.isModified('username') && !self.isNew) {
				resolve(true);
			} else {
				const user = await self.constructor.findOne({ username });

				user === null ? resolve(true) : resolve(false);
			}
		});
	},
	message: 'The specified username is already in use'
});

UserSchema.path('email').validate({
	validator: function (email) {
		const self = this;

		return new Promise(async (resolve, _) => {
			if (!self.isNew) {
				resolve(true);
			} else {
				const user = await self.constructor.findOne({ email });

				user === null ? resolve(true) : resolve(false);
			}
		});
	},
	message: 'The specified email is already in use'
});

var validatePresenceOf = value => {
	return value && value.length;
};

UserSchema.pre('save', function (next) {
	const currentDate = new Date();
	this.updatedAt = currentDate;

	// Handle new/update passwords
	if (this.isModified('password')) {
		if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
			next(new Error('Invalid password'));
		}

		// Make salt with a callback
		try {
			this.salt = this.makeSalt();
		} catch (ex) {
			return next(ex);
		}

		try {
			this.password = this.encryptPassword(this.password);
		} catch (ex) {
			return next(ex);
		}
		next();
	} else {
		next();
	}
});

UserSchema.index({ username: 1 }, { background: true });
UserSchema.index({ email: 1 }, { background: true });

exports.default = _mongoose2.default.model('User', UserSchema);
//# sourceMappingURL=user.js.map
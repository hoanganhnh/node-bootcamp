/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'User must have a name'],
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'User must have a email'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email !'],
	},
	photo: {
		type: String,
	},
	password: {
		type: String,
		required: [true, 'User must have a password'],
		minlength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'User must have a passwordConfirm'],
		minlength: 8,
		validate: {
			validator(ele) {
				return ele === this.password;
			},
			message: 'Password is not same !',
		},
	},
	role: {
		type: String,
		enum: ['user', 'admin', 'lead-guide', 'guide'],
		default: 'user',
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

userSchema.pre('save', async function (next) {
	// Only run this func if password was actually modified
	if (!this.isModified('password')) {
		return next();
	}
	// Hash the password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;

	return next();
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password') || this.isNew) {
		return next();
	}

	this.passwordChangedAt = Date.now() - 1000;

	return next();
});

userSchema.pre(/^find/, function (next) {
	// this points to the current query
	this.find({ active: { $ne: false } });
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword,
) {
	const result = await bcrypt.compare(candidatePassword, userPassword);

	return result;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10,
		);

		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	console.log({ resetToken }, this.passwordResetToken);

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
		default: 'user',
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

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;

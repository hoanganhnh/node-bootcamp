const mongoose = require('mongoose');
const validator = require('validator');

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
	},
	role: {
		type: String,
		default: 'user',
	},
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;

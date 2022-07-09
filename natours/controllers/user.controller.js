const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const signup = catchAsync(async (req, res) => {
	const newUser = await UserModel.create(req.body);

	const token = signToken(newUser._id);

	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser,
		},
	});
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new AppError(`Please provide email and password !`, 400));
	}

	const user = await UserModel.findOne({ email }).select('+password');

	const correct = await user.correctPassword(password, user.password);

	if (!user || !correct) {
		return next(new AppError(`Incorrect email and password !`, 401));
	}

	const token = signToken(user._id);
	return res.status(201).json({
		status: 'success',
		token,
	});
});

module.exports = {
	signup,
	login,
};

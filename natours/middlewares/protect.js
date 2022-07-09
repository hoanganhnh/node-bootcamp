const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const UserModel = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
	// 1) Getting token and check of it's there
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		// eslint-disable-next-line prefer-destructuring
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(
			new AppError(
				'You are not logged in! Please log in to get access.',
				401,
			),
		);
	}
	// 2) Verification token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	// 3) Check if user still exists
	const currentUser = await UserModel.findById(decoded.id);
	if (!currentUser) {
		return next(
			new AppError(
				'The user belonging to this token does no longer exist.',
				401,
			),
		);
	}

	// 4) Check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError(
				'User recently changed password! Please log in again.',
				401,
			),
		);
	}
	req.user = currentUser;
	return next();
});

module.exports = protect;

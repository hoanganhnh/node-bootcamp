const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserModel = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(
			Date.now() +
				process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		cookieOptions.secure = true;
	}

	res.cookie('cookie_secret', token, cookieOptions);

	// Remove password from output
	// eslint-disable-next-line no-param-reassign
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

const signup = catchAsync(async (req, res) => {
	const newUser = await UserModel.create(req.body);

	createSendToken(newUser, 201, res);
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

	return createSendToken(user, 200, res);
});

const forgotPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on POSTed email
	const user = await UserModel.findOne({ email: req.body.email });

	if (!user) {
		return next(new AppError(`There is no user with email address !`, 404));
	}

	// 2) Generate the random reset token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	// 3) Send it to user's email
	const resetURL = `${req.protocol}://${req.get(
		'host',
	)}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (valid for 10 min)',
			message,
		});

		return res.status(200).json({
			status: 'success',
			message: 'Token sent to email!',
		});
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError(
				'There was an error sending the email. Try again later!',
			),
			500,
		);
	}
});

const resetPassword = catchAsync(async (req, res, next) => {
	// 1) Get user base on token
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await UserModel.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	// 2) If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError('Token is invalid or has expired', 400));
	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save({ validateBeforeSave: false });

	// 3) Update changedPasswordAt property for the user
	// 4) Log the user in, send JWT
	return createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
	// 1) Get user from collection
	const user = await UserModel.findById(req.user.id).select('+password');

	const correctPassword = await user.correctPassword(
		req.body.passwordCurrent,
		user.password,
	);
	// 2) Check if POSTed current password is correct
	if (!correctPassword) {
		return next(new AppError('Your current password is wrong !', 401));
	}
	// 3) If so, update password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();
	//! User.findByIdAndUpdate will NOT work as intended!
	// 4) Log user in, send JWT
	return createSendToken(user, 200, res);
});

module.exports = {
	signup,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
};

/* eslint-disable no-param-reassign */
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value} !`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	console.log(value);

	const message = `Duplicate field value: ${value}. Please use another value !`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);

	const message = `Invalid input data. ${errors.join('. ')} !`;
	return new AppError(message, 400);
};

const handleJWTError = () =>
	new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
	new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (error, err, res) => {
	res.status(error.statusCode).json({
		status: error.status,
		message: err.message,
		error: err,
		stack: err.stack,
	});
};

const sendErrorProduct = (error, err, res) => {
	if (err.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: err.message,
		});
	} else {
		//  Error unknown
		console.error('ERROR 💥', err);

		res.status(500).json({
			status: 'error',
			meassge: 'Something went very wrong !',
		});
	}
};

const globalErrorHandler = (err, req, res, next) => {
	const error = {
		statusCode: err.statusCode || 500,
		status: err.status || 'error',
	};

	const updateStateError = () => {
		error.status = err.status;
		error.statusCode = err.statusCode;
	};

	console.log(err.name);

	if (process.env.NODE_ENV === 'development') {
		if (err.name === 'JsonWebTokenError') {
			err = handleJWTError();
			updateStateError();
		}
		if (err.name === 'TokenExpiredError') {
			err = handleJWTExpiredError();
			updateStateError();
		}

		sendErrorDev(error, err, res);
	} else if (
		process.env.NODE_ENV === 'product' ||
		process.env.NODE_ENV.includes('product')
	) {
		if (err.name === 'CastError') {
			err = handleCastErrorDB(err);
			updateStateError();
		}
		if (err.code === 11000) {
			err = handleDuplicateFieldsDB(err);
			updateStateError();
		}

		if (err.name === 'ValidationError') {
			err = handleValidationErrorDB(err);
			updateStateError();
		}

		if (err.name === 'JsonWebTokenError') {
			err = handleJWTError();
			updateStateError();
		}

		if (err.name === 'TokenExpiredError') {
			err = handleJWTExpiredError();
			console.log(err.status);
			updateStateError();
		}

		sendErrorProduct(error, err, res);
	}

	next();
};

module.exports = { globalErrorHandler };

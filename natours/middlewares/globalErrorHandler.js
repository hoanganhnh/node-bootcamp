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

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(error, err, res);
	} else if (
		process.env.NODE_ENV === 'product' ||
		process.env.NODE_ENV.includes('product')
	) {
		console.log(err.name);
		if (err.name === 'CastError') {
			err = handleCastErrorDB(err);
		}
		if (err.code === 11000) {
			err = handleDuplicateFieldsDB(err);
		}

		if (err.name === 'ValidationError') {
			err = handleValidationErrorDB(err);
		}
		sendErrorProduct(error, err, res);
	}

	next();
};

module.exports = { globalErrorHandler };

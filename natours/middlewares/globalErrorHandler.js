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
	} else if (process.env.NODE_ENV === 'product') {
		sendErrorProduct(error, err, res);
	}

	next();
};

module.exports = { globalErrorHandler };

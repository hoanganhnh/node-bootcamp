const globalErrorHandler = (err, req, res, next) => {
	const error = {
		statusCode: err.statusCode || 404,
		status: err.status || 'error',
	};

	res.status(error.statusCode).json({
		status: error.status,
		message: err.message,
	});

	next();
};

module.exports = { globalErrorHandler };

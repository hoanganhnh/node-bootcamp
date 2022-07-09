const tourRouter = require('./tour.route');
const userRouter = require('./user.route');

function routes(app) {
	app.use('/api/v1/tour', tourRouter);
	app.use('/api/v1/auth', userRouter);
}

module.exports = routes;

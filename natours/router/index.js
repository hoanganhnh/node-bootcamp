const tourRouter = require('./tour.route');
const authRouter = require('./auth.route');
const userRouter = require('./user.route');

function routes(app) {
	app.use('/api/v1/tour', tourRouter);
	app.use('/api/v1/auth', authRouter);
	app.use('/api/v1/user', userRouter);
}

module.exports = routes;

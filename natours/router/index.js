const tourRouter = require('./tour.route');
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const reviewRoute = require('./review.route');
const viewRouter = require('./view.route');

function routes(app) {
	app.use('/', viewRouter);
	app.use('/api/v1/tour', tourRouter);
	app.use('/api/v1/auth', authRouter);
	app.use('/api/v1/user', userRouter);
	app.use('/api/v1/reviews', reviewRoute);
}

module.exports = routes;

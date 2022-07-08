const tourRouter = require('./tour.route');

function routes(app) {
	app.use('/api/v1/tour', tourRouter);
}

module.exports = routes;

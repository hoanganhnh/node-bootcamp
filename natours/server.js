const app = require('./app');

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
	console.log(`Sever running on ${port}`);
});

process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);

	server.close(() => {
		// eslint-disable-next-line no-process-exit
		process.exit(1);
	});
});

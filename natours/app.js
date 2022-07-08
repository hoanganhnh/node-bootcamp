const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

const routes = require('./router');
const { isDev } = require('./constants');
const connectToDB = require('./libs/connectDB');

dotenv.config({ path: './config.env' });

const app = express();

// connect to mongodb
connectToDB();

//  MIDDLEWARES
if (isDev) {
	app.use(morgan('dev'));
}

// body parser
app.use(express.json());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

app.get('/', (req, res) => {
	res.status(200).send('Hello express !');
});

routes(app);

app.all('*', (req, res) => {
	res.status(404).json({
		status: 'fail',
		message: `Can't find ${req.originalUrl} on this server !`,
	});
});

module.exports = app;

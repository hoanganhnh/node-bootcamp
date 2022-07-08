const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

const routes = require('./router');
const { isDev } = require('./constants');
const connectToDB = require('./libs/connectDB');
const AppError = require('./utils/appError');
const { globalErrorHandler } = require('./middlewares/globalErrorHandler');

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

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

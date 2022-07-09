const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

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
// Implementing Rate Limiting
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
	message: 'Too many requests from this IP, please try again in an hour !',
});
app.use('/api', limiter);

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

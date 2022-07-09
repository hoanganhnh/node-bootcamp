const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const routes = require('./router');
const { isDev } = require('./constants');
const connectToDB = require('./libs/connectDB');
const AppError = require('./utils/appError');
const { globalErrorHandler } = require('./middlewares/globalErrorHandler');

dotenv.config({ path: './config.env' });

const app = express();

// connect to mongodb
connectToDB();

// Setting Security HTTP Headers
app.use(helmet());

//  dev logging request
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

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
// body parser
app.use(express.json({ limit: '10kb' }));

// test middleware
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

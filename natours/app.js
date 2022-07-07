const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = express();

// connect to mongodb
const isDev = process.env.NODE_ENV === 'development';
const DB_URL = isDev ? process.env.DATABASE_LOCAL : process.env.DATABASE_URL;
mongoose
	.connect(DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection successful!'));

//  MIDDLEWARES
if (isDev) {
	app.use(morgan('dev'));
}

app.get('/', (req, res) => {
	res.status(200).send('Hello express !');
});

module.exports = app;

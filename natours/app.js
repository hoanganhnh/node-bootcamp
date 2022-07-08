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

app.get('/', (req, res) => {
	res.status(200).send('Hello express !');
});

routes(app);

module.exports = app;

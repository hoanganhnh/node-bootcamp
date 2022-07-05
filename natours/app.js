const express = require('express');
const morgan = require('morgan');

const app = express();

//  MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.get('/', (req, res) => {
	res.status(200).send('Hello express !');
});

module.exports = app;

const mongoose = require('mongoose');

const { isDev } = require('../constants');

const DB_URL = isDev ? process.env.DATABASE_LOCAL : process.env.DATABASE_URL;

function connectToDB() {
	mongoose
		.connect(DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log('DB connection successful!'));
}

module.exports = connectToDB;

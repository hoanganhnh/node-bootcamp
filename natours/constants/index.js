const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const isDev = process.env.NODE_ENV === 'development';

module.exports = { isDev };

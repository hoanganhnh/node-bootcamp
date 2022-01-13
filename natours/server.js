const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;

console.log(process.env.PORT);

app.listen(port, () => {
	console.log(`Sever running on ${port}`);
});

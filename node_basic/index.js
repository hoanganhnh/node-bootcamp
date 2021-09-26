const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemPlate');

/*
const text = fs.readFileSync('./txt/input.txt', 'utf8'); // read file

console.log(text);

const textOutput = 'Bye node'

fs.writeFileSync('./txt/onput.txt', textOutput); // write file
console.log('Done !');
*/
/**
 *
fs.readFileSync('./txt/start.txt', 'utf-8', function(err, data) {
    if (err) {
        return console.log('Erro !')
    }
    console.log(data);
})
 *
 */

const tempOverView = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	'utf-8',
);
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	'utf-8',
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	'utf-8',
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

// SERVER && Routing
const server = http.createServer((req, res) => {
	// eslint-disable-next-line node/no-deprecated-api
	const { query, pathname } = url.parse(req.url, true);

	if (pathname === '/' || pathname === '/overview') {
		// Overview page
		res.writeHead(200, {
			'Content-type': 'ext/html',
		});

		const cardHtmls = dataObj.map((el) => replaceTemplate(tempCard, el));

		const outputHtml = tempOverView.replace('{%PRODUCT_CARDS%}', cardHtmls);

		res.end(outputHtml);
	} else if (pathname === '/product') {
		// Product page
		res.writeHead(200, {
			'Content-type': 'text/html',
		});

		const product = dataObj[query.id];
		const outputHtml = replaceTemplate(tempProduct, product);

		res.end(outputHtml);
	} else if (pathname === '/api') {
		// API
		res.writeHead(200, {
			'Content-type': 'application/json',
		});
		res.end(data);

		// Not found
	} else {
		res.writeHead(404, {
			'Content-type': 'text/html',
			'my-own-header': 'hello-world',
		});
		res.end('<h1>Page not found!</h1>');
	}
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Server listening on port 8000');
});

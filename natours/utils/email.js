const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
	// 1) Create a transporter
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
		port: process.env.EMAIL_PORT || 2525,
		auth: {
			user: process.env.EMAIL_USERNAME || '4739e002ab0bad',
			pass: process.env.EMAIL_PASSWORD || 'd5a4ac71ac8d0c',
		},
	});

	// 2) Define the email options
	const mailOptions = {
		from: 'Hoang Anh <hoahoanganh20012001@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.message,
		// html:
	};

	// 3) Actually send the email
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

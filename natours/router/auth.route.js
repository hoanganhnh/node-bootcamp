const express = require('express');

const {
	signup,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
} = require('../controllers/auth.controller');
const protect = require('../middlewares/protect');

const authRouter = express.Router();

authRouter.route('/signup').post(signup);
authRouter.route('/login').post(login);
authRouter.route('/forgotPassword').post(forgotPassword);
authRouter.route('/resetPassword/:token').patch(resetPassword);
authRouter.route('/updatePassword').patch(protect, updatePassword);

module.exports = authRouter;

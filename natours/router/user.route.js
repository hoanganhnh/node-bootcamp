const express = require('express');

const {
	signup,
	login,
	forgotPassword,
	resetPassword,
} = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);
userRouter.route('/forgotPassword').post(forgotPassword);
userRouter.route('/resetPassword/:token').patch(resetPassword);

module.exports = userRouter;

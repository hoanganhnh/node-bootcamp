const express = require('express');

const {
	signup,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
} = require('../controllers/user.controller');
const protect = require('../middlewares/protect');

const userRouter = express.Router();

userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);
userRouter.route('/forgotPassword').post(forgotPassword);
userRouter.route('/resetPassword/:token').patch(resetPassword);
userRouter.route('/updatePassword').patch(protect, updatePassword);

module.exports = userRouter;

const express = require('express');

const {
	getAllUsers,
	updateMe,
	getMe,
	deleteMe,
	deleteUser,
} = require('../controllers/user.controller');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const userRouter = express.Router();

userRouter.route('/').get(protect, restrictTo('admin'), getAllUsers);
userRouter.route('/me').get(protect, getMe);
userRouter.route('/updateMe').patch(protect, updateMe);
userRouter.route('/deleteMe').delete(protect, deleteMe);
userRouter
	.route('/deleteUser/:id')
	.delete(protect, restrictTo('admin'), deleteUser);

module.exports = userRouter;

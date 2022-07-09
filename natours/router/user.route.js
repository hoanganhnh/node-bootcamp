const express = require('express');

const {
	getAllUsers,
	updateMe,
	getUserInfor,
} = require('../controllers/user.controller');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const userRouter = express.Router();

userRouter.route('/').get(protect, restrictTo('admin'), getAllUsers);
userRouter.route('/userInfor').get(protect, getUserInfor);
userRouter.route('/updateMe').patch(protect, updateMe);

module.exports = userRouter;

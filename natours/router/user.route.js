const express = require('express');

const {
	getAllUsers,
	updateMe,
	getMe,
	getUser,
	deleteMe,
	deleteUser,
	updateUser,
} = require('../controllers/user.controller');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const userRouter = express.Router();

userRouter.use(protect);

userRouter.route('/me').get(getMe, getUser);
userRouter.route('/updateMe').patch(updateMe);
userRouter.route('/deleteMe').delete(deleteMe);

userRouter.use(restrictTo('admin'));

userRouter.route('/').get(getAllUsers);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;

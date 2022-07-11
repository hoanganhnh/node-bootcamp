const UserModel = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
	deleteOne,
	updateOne,
	getOne,
	getAll,
} = require('../utils/handleFactory');

// eslint-disable-next-line no-unused-vars
const filterObj = (obj, ...values) => {
	const resultObj = {};
	Object.keys(obj).forEach((key) => {
		if (values.includes(key)) {
			resultObj[key] = obj[key];
		}
	});

	return resultObj;
};

const getAllUsers = getAll(UserModel, 'User');

const updateMe = catchAsync(async (req, res, next) => {
	// 1) Create error if user POSTs password data
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'This route is not for password updates. Please use /updatePassword.',
				400,
			),
		);
	}

	// 2) Filtered out unwanted fields names that are not allowed to be updated
	const filteredBody = filterObj(req.body, 'name', 'photo');

	// 3) Update user document
	const updatedUser = await UserModel.findByIdAndUpdate(
		req.user.id,
		filteredBody,
		{
			new: true,
			runValidators: true,
		},
	);

	return res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
});

const getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

const getUser = getOne(UserModel, 'User');

const deleteMe = catchAsync(async (req, res) => {
	await UserModel.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: 'success',
		message: 'Delete user successfull !',
	});
});

const deleteUser = deleteOne(UserModel, 'User');
const updateUser = updateOne(UserModel, 'User');

module.exports = {
	getAllUsers,
	updateMe,
	getMe,
	getUser,
	deleteMe,
	deleteUser,
	updateUser,
};

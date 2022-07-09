const UserModel = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res) => {
	const newUser = await UserModel.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
		},
	});
});

module.exports = {
	signup,
};

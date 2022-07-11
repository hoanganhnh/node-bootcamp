const catchAsync = require('./catchAsync');
const AppError = require('./appError');

const deleteOne = (Model, nameDoc) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) {
			return next(
				new AppError(`No ${nameDoc} document found with that ID`, 404),
			);
		}

		return res.status(204).json({
			status: 'success',
			data: null,
		});
	});

module.exports = {
	deleteOne,
};

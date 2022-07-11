const catchAsync = require('./catchAsync');
const AppError = require('./appError');
const APITourFeatures = require('./apiTourFeatures');

const getAll = (Model, nameDoc) =>
	catchAsync(async (req, res, next) => {
		// To allow for nested GET reviews on tour (hack)
		const filter = {};
		if (req.params.tourId) {
			filter.tour = req.params.tourId;
		}

		const features = new APITourFeatures(Model.find(filter), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();
		// const doc = await features.query.explain();
		const doc = await features.query;

		if (!doc) {
			return next(new AppError(`Error get ${nameDoc} document !`, 404));
		}

		return res.status(200).json({
			status: 'success',
			results: doc.length,
			data: {
				[`${nameDoc.toLowerCase()}`]: doc,
			},
		});
	});

const createOne = (Model, nameDoc) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);
		if (!doc) {
			return next(
				new AppError(`Error create ${nameDoc} document !`, 404),
			);
		}

		return res.status(201).json({
			status: 'success',
			data: {
				[`${nameDoc.toLowerCase()}`]: doc,
			},
		});
	});

const getOne = (Model, nameDoc, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOptions) query = query.populate(popOptions);
		const doc = await query;

		if (!doc) {
			return next(
				new AppError(`No ${nameDoc} document found with that ID`, 404),
			);
		}

		return res.status(200).json({
			status: 'success',
			data: {
				[`${nameDoc.toLowerCase()}`]: doc,
			},
		});
	});

const updateOne = (Model, nameDoc) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) {
			return next(
				new AppError(`No ${nameDoc} document found with that ID`, 404),
			);
		}

		return res.status(200).json({
			status: 'success',
			data: {
				[`${nameDoc.toLowerCase()}`]: doc,
			},
		});
	});

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
			[`${nameDoc.toLowerCase()}`]: null,
		});
	});

module.exports = {
	createOne,
	getOne,
	updateOne,
	deleteOne,
	getAll,
};

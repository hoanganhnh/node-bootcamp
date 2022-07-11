const TourModel = require('../models/tour.model');
const APITourFeatures = require('../utils/apiTourFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, createOne } = require('../utils/handleFactory');

const aliasTopTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

const getAllTours = catchAsync(async (req, res) => {
	// @TODO: Update check page doesnt exist
	// if (req.query.page) {
	// 	const page = this.query.page * 1 || 1;
	// 	const limit = this.query.limit * 1 || 100;
	// 	const skip = (page - 1) * limit;
	// 	const numTours = await TourModel.countDocuments();
	// 	if (skip >= numTours) {
	// 		throw new Error('This page doesnt exist !');
	// 	}
	// }

	const features = new APITourFeatures(TourModel.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();
	const tours = await features.query;

	res.status(201).json({
		status: 'success',
		result: tours.length,
		data: {
			tour: tours,
		},
	});
});

const getTour = catchAsync(async (req, res) => {
	const { id } = req.params;
	// find one TourModel.findOne({_id: req.params.id})
	const tour = await TourModel.findById(id)
		.populate({
			path: 'guides',
			select: '-__v -passwordChangedAt',
		})
		.populate({
			path: 'reviews',
		});

	if (!tour) {
		return new AppError(
			`Can't find tour with that id on this server !`,
			404,
		);
	}
	return res.status(201).json({
		status: 'success',
		data: {
			tour,
		},
	});
});

const updateTour = updateOne(TourModel, 'Tour');

const deleteTour = deleteOne(TourModel, 'Tour');

const createTour = createOne(TourModel, 'Tour');

/**
 *
 * @see https://www.mongodb.com/docs/manual/reference/operator/query/
 * @see https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/
 */
const getTourStats = async (req, res) => {
	try {
		const stats = await TourModel.aggregate([
			{
				$match: {
					ratingsAverage: {
						$gte: 4.5,
					},
				},
			},
			{
				$group: {
					_id: {
						$toUpper: '$difficulty',
					},
					num: {
						$sum: 1,
					},
					numRatings: {
						$sum: '$ratingsQuantity',
					},
					avgRating: {
						$avg: '$ratingsAverage',
					},
					avgPrice: {
						$avg: '$price',
					},
					minPrice: {
						$min: '$price',
					},
					maxPrice: {
						$max: '$price',
					},
				},
			},
			{
				$sort: {
					avgPrice: 1,
				},
			},
			{
				$match: {
					_id: {
						$ne: 'EASY',
					},
				},
			},
		]);

		res.status(201).json({
			status: 'success',
			data: {
				tour: stats,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error,
		});
	}
};

/**
 *
 * Aggregation Pipeline Unwinding and Projecting
 * @see https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/
 */
const getMonthlyPlan = async (req, res) => {
	try {
		const year = req.params.year * 1; // 2021

		const plan = await TourModel.aggregate([
			{
				$unwind: '$startDates',
			},
			{
				$match: {
					startDates: {
						$gte: new Date(`${year}-01-01`),
						$lte: new Date(`${year}-12-31`),
					},
				},
			},
			{
				$group: {
					_id: { $month: '$startDates' },
					numTourStarts: { $sum: 1 },
					tours: {
						$push: '$name',
					},
				},
			},
			{
				$addFields: { month: '$_id' },
			},
			{
				$project: {
					_id: 0,
				},
			},
			{
				$sort: {
					numTourStarts: -1,
				},
			},
			{
				$limit: 6,
			},
		]);

		res.status(201).json({
			status: 'success',
			result: plan.length,
			data: {
				plan,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error,
		});
	}
};

module.exports = {
	getAllTours,
	getTour,
	createTour,
	updateTour,
	deleteTour,
	aliasTopTours,
	getTourStats,
	getMonthlyPlan,
};

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

/**
 *  @see https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/
 *  @see https://www.mongodb.com/docs/manual/reference/operator/query/centerSphere/
 */
// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
const getToursWithin = catchAsync(async (req, res, next) => {
	const { distance, latlng, unit } = req.params;
	const [lat, lng] = latlng.split(',');

	const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

	if (!lat || !lng) {
		next(
			new AppError(
				'Please provide latitutr and longitude in the format lat,lng.',
				400,
			),
		);
	}

	const tours = await TourModel.find({
		startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours,
		},
	});
});

/**
 *  @see https://www.mongodb.com/docs/manual/reference/operator/aggregation/geoNear/
 */

const getDistances = catchAsync(async (req, res, next) => {
	const { latlng, unit } = req.params;
	const [lat, lng] = latlng.split(',');

	const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

	if (!lat || !lng) {
		next(
			new AppError(
				'Please provide latitutr and longitude in the format lat,lng.',
				400,
			),
		);
	}

	const distances = await TourModel.aggregate([
		{
			$geoNear: {
				near: {
					type: 'Point',
					coordinates: [lng * 1, lat * 1],
				},
				distanceField: 'distance',
				distanceMultiplier: multiplier,
			},
		},
		{
			$project: {
				distance: 1,
				name: 1,
			},
		},
	]);

	res.status(200).json({
		status: 'success',
		data: {
			distances,
		},
	});
});

module.exports = {
	getAllTours,
	getTour,
	createTour,
	updateTour,
	deleteTour,
	aliasTopTours,
	getTourStats,
	getMonthlyPlan,
	getToursWithin,
	getDistances,
};

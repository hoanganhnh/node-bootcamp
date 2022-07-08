const TourModel = require('../models/tour.model');
const APITourFeatures = require('../utils/apiTourFeatures');

const aliasTopTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

const getAllTours = async (req, res) => {
	try {
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
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error,
		});
	}
};

const getTour = async (req, res) => {
	try {
		const { id } = req.params;
		// find one TourModel.findOne({_id: req.params.id})
		const tour = await TourModel.findById(id);
		res.status(201).json({
			status: 'success',
			data: {
				tour,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error,
		});
	}
};

const updateTour = async (req, res) => {
	try {
		const { id } = req.params;
		const tour = await TourModel.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(201).json({
			status: 'success',
			data: {
				tour,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error,
		});
	}
};

const deleteTour = async (req, res) => {
	try {
		const { id } = req.params;
		await TourModel.findByIdAndDelete(id);

		res.status(201).json({
			status: 'success',
			data: null,
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error,
		});
	}
};

const createTour = async (req, res) => {
	try {
		const newTour = await TourModel.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour,
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

module.exports = {
	getAllTours,
	getTour,
	createTour,
	updateTour,
	deleteTour,
	aliasTopTours,
	getTourStats,
};

const TourModel = require('../models/tour.model');

const aliasTopTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

const getAllTours = async (req, res) => {
	try {
		console.log(req.query);
		// 1.A. Filtering
		const queryObj = { ...req.query };
		const excludeField = ['page', 'sort', 'limit', 'fields'];
		excludeField.forEach((field) => delete queryObj[field]);
		// 1.B. Advanced filtering

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(match) => `$${match}`,
		);
		// MongoDB Comparison Query Operators: gte, gt, lte, lt
		/**
		 * (>) greater than - $gt
		 * (<) less than - $lt
		 * (>=) greater than equal to - $gte
		 * (<= ) less than equal to - $lte
		 */
		// { difficulty: 'easy', duration: { gte: '5' } } --> { difficulty: 'easy', duration: { '$gte': '5' } }

		// const tours = await TourModel.find().where('duration').equals(5);
		let query = TourModel.find(JSON.parse(queryStr));

		// 2. Sorting

		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createAt');
		}

		// 3. Field limiting
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		} else {
			query = query.select('-__v');
		}

		// 4. Pagination
		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 100;
		const skip = (page - 1) * limit;
		query = query.skip(skip).limit(limit);

		if (req.query.page) {
			const numTours = await TourModel.countDocuments();
			if (skip >= numTours) {
				throw new Error('This page doesnt exist !');
			}
		}

		const tours = await query;

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

module.exports = {
	getAllTours,
	getTour,
	createTour,
	updateTour,
	deleteTour,
	aliasTopTours,
};

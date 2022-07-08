const TourModel = require('../models/tour.model');

const getAllTours = async (req, res) => {
	try {
		const tours = await TourModel.find();
		res.status(201).json({
			status: 'success',
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
};

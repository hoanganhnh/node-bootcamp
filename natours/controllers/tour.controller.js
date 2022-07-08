const TourModel = require('../models/tour.model');

const createTour = async (req, res) => {
	try {
		const newTour = await TourModel.create(req.body);

		res.status(201).json({
			status: 'succes',
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
	createTour,
};

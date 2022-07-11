const ReviewModel = require('../models/review.model');
const {
	deleteOne,
	getOne,
	updateOne,
	createOne,
	getAll,
} = require('../utils/handleFactory');

const getAllReviews = getAll(ReviewModel, 'Reviews');

const getReview = getOne(ReviewModel, 'Review');

const setTourUserIds = (req, res, next) => {
	// Allow nested routes
	const { tourId } = req.params;

	if (!req.body.tour) {
		req.body.tour = tourId;
	}
	if (!req.body.user) {
		req.body.user = req.user.id;
	}

	return next();
};

const createReview = createOne(ReviewModel, 'Review');

const updateReview = updateOne(ReviewModel, 'Review');

const deleteReview = deleteOne(ReviewModel, 'Review');

module.exports = {
	getAllReviews,
	createReview,
	getReview,
	updateReview,
	deleteReview,
	setTourUserIds,
};

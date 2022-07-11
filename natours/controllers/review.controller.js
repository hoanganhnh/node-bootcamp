const ReviewModel = require('../models/review.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllReviews = catchAsync(async (req, res) => {
	const filter = {};
	if (req.params.tourId) {
		filter.tour = req.params.tourId;
	}
	const reviews = await ReviewModel.find(filter);

	res.status(200).json({
		status: 'success',
		results: reviews.length,
		data: {
			reviews,
		},
	});
});

const createReview = catchAsync(async (req, res) => {
	// Allow nested routes
	if (!req.body.tour) {
		req.body.tour = req.params.tourId;
	}
	if (!req.body.user) {
		req.body.user = req.user.id;
	}
	const newReview = await ReviewModel.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			review: newReview,
		},
	});
});

const updateReview = catchAsync(async (req, res, next) => {
	const { reviewId } = req.params;
	const review = await ReviewModel.findByIdAndUpdate(reviewId, req.body, {
		new: true,
		runValidators: true,
	});

	if (!review) {
		return next(new AppError(`Update review fail !`, 500));
	}
	return res.status(201).json({
		status: 'success',
		data: {
			review,
		},
	});
});

module.exports = {
	getAllReviews,
	createReview,
	updateReview,
};

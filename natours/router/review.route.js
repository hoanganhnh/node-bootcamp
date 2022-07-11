const express = require('express');

const {
	getAllReviews,
	createReview,
	updateReview,
} = require('../controllers/review.controller');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const reviewRoute = express.Router({ mergeParams: true });

// GET /tour/123/reviews
// POST /tour/123/reviews

reviewRoute
	.route('/')
	.get(getAllReviews)
	.post(protect, restrictTo('admin', 'user'), createReview);

reviewRoute
	.route('/:reviewId')
	.patch(protect, restrictTo('admin', 'user'), updateReview);

module.exports = reviewRoute;

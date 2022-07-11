const express = require('express');

const {
	getAllReviews,
	createReview,
	updateReview,
	deleteReview,
	getReview,
	setTourUserIds,
} = require('../controllers/review.controller');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const reviewRoute = express.Router({ mergeParams: true });

// GET /tour/123/reviews
// POST /tour/123/reviews

reviewRoute
	.route('/')
	.get(getAllReviews)
	.post(protect, restrictTo('admin', 'user'), setTourUserIds, createReview);

reviewRoute.use(protect, restrictTo('admin', 'user'));

reviewRoute
	.route('/:id')
	.post(getReview)
	.delete(deleteReview)
	.patch(updateReview);

module.exports = reviewRoute;

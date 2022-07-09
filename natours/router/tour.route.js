const express = require('express');

const {
	createTour,
	getAllTours,
	getTour,
	updateTour,
	deleteTour,
	aliasTopTours,
	getTourStats,
	getMonthlyPlan,
} = require('../controllers/tour.controller');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const tourRouter = express.Router();

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);

tourRouter.route('/').get(getAllTours).post(protect, createTour);

tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRouter
	.route('/:id')
	.get(getTour)
	.patch(protect, restrictTo('admin'), updateTour)
	.delete(protect, restrictTo('admin'), deleteTour);

module.exports = tourRouter;

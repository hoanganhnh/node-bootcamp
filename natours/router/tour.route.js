const express = require('express');

const {
	createTour,
	getAllTours,
	getTour,
	updateTour,
	deleteTour,
	aliasTopTours,
	getTourStats,
} = require('../controllers/tour.controller');

const tourRouter = express.Router();

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/tour-stats').get(getTourStats);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;

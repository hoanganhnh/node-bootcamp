const express = require('express');

const {
	createTour,
	getAllTours,
	getTour,
	updateTour,
	deleteTour,
} = require('../controllers/tour.controller');

const tourRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;

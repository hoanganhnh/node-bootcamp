const express = require('express');

const { createTour } = require('../controllers/tour.controller');

const tourRouter = express.Router();

tourRouter.route('/').post(createTour);

module.exports = tourRouter;

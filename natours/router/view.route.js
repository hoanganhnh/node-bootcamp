const express = require('express');

const {
	getOverview,
	getTourView,
	getLoginForm,
	getSignupForm,
} = require('../controllers/view.controller');

const viewRouter = express.Router();

viewRouter.get('/', getOverview);
viewRouter.get('/tour/:slug', getTourView);
viewRouter.get('/login', getLoginForm);
viewRouter.get('/signup', getSignupForm);

module.exports = viewRouter;

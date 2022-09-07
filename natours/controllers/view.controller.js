const TourModel = require('../models/tour.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res) => {
	// 1) Get tour data from collection
	// @TODO: add pagination
	const tours = await TourModel.find();

	// 2) Build template
	// 3) Render that template using tour data from 1)
	res.status(200).render('overview', {
		title: 'All Tours',
		tours,
	});
});

const getTourView = catchAsync(async (req, res, next) => {
	// 1) Get the data, for the requested tour (including reviews and guides)
	const tour = await TourModel.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});

	if (!tour) {
		return next(new AppError('There is no tour with that name.', 404));
	}

	// 2) Build template
	// 3) Render template using data from 1)
	return res.status(200).render('tour', {
		title: `${tour.name} Tour`,
		tour,
	});
});

const getLoginForm = (req, res) => {
	res.status(200).render('login', {
		title: 'Log into your account',
	});
};

const getSignupForm = (req, res) => {
	res.status(200).render('signup', {
		title: 'Sign up your account',
	});
};

module.exports = {
	getOverview,
	getTourView,
	getLoginForm,
	getSignupForm,
};

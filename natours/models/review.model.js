/* eslint-disable func-names */
const mongoose = require('mongoose');

const reveiwSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, 'Review can not to empty'],
			unique: true,
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
		},
		createAt: {
			type: Date,
			default: Date.now,
		},
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

reveiwSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'tour',
		select: 'name',
	}).populate({
		path: 'user',
		select: 'name photo',
	});

	next();
});

const ReviewModel = mongoose.model('Review', reveiwSchema);

module.exports = ReviewModel;

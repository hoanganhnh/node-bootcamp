class APITourFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	/**
	 * @example /api/v1/tour?duration=5&difficulty=easy
	 * @example /api/v1/tour?duration=5&difficulty=easy&page=2&sort=price&limit=10&fiedls=maxGroupSize
	 * @example /api/v1/tour?duration=5&difficulty=easy&price[lt]=1500
	 * @returns this
	 */
	filter() {
		const queryObj = { ...this.queryString };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach((el) => delete queryObj[el]);

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(match) => `$${match}`,
		);

		// MongoDB Comparison Query Operators: gte, gt, lte, lt
		/**
		 * (>) greater than - $gt
		 * (<) less than - $lt
		 * (>=) greater than equal to - $gte
		 * (<= ) less than equal to - $lte
		 */
		// { difficulty: 'easy', duration: { gte: '5' } } --> { difficulty: 'easy', duration: { '$gte': '5' } }

		// const tours = await TourModel.find().where('duration').equals(5);

		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	/**
	 * (-) --> DESC: max -> min
	 * (+) --> ASC: min --> max
	 * @example /api/v1/tour?sort=-price
	 * @example /api/v1/tour?sort=price
	 * @example /api/v1/tour?sort=-price,ratingsQuantity,duration
	 * @returns this
	 */
	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}

		return this;
	}

	/**
	 * @example /api/v1/tour?fields=name,duration
	 * @returns this
	 */
	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}

		return this;
	}

	/**
	 * @example /page=1&limit=3
	 * @example /page=1&limit=4
	 * @returns this
	 */
	paginate() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

module.exports = APITourFeatures;

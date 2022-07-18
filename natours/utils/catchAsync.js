module.exports = (fn) => {
	return (...agrs) => {
		const fnReturns = fn(...agrs);
		const next = agrs[agrs.length - 1];
		return Promise.resolve(fnReturns).catch(next);
	};
};

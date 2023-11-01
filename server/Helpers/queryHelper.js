// // search helper
// // paginate helper

// const searchHelper = (searchKey, query, req) => {
// 	if (req.query.search) {
// 		const searchObject = {};
// 		searchObject[searchKey] = new RegExp(req.query.search, "i");
// 		query = query.where(searchObject);
// 	}

// 	return query;
// };

// const paginateHelper = (model, query, req) => {
// 	const page = parseInt(req.query.page) || 1;
// 	const pageSize = parseInt(req.query.limit) || 10;
// 	const skip = (page - 1) * pageSize;
// };

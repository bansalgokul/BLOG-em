const errorFunction = async (res, statusCode, error) => {
	return res.status(statusCode).json({
		status: "failed",
		error,
	});
};

module.exports = errorFunction;

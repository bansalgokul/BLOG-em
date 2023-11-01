const joi = require("joi");
const errorFunction = require("../../Helpers/errorFunction");

const addCommentValidator = async (req, res, next) => {
	const validator = joi.object({
		post: joi.string().required(),
		message: joi.string().required(),
		author: joi.string().required(),
		likes: req.array().default([]),
	});

	const payload = {
		post: req.body.target,
		message: req.body.message,
		author: req.user._id,
		likes: req.body.likes,
	};

	try {
		const value = await validator.validateAsync(payload);
		req.payload = value;
		next();
	} catch (err) {
		return errorFunction(res, 406, `Error in User Data : ${err.message}`);
	}
};

const editCommentValidator = async (req, res, next) => {
	const validator = joi.object({
		target: joi.string().required(),
		message: joi.string().required(),
		user: joi.string().required(),
	});

	const payload = {
		target: req.body.target,
		message: req.body.message,
		user: req.user._id,
	};

	try {
		const value = await validator.validateAsync(payload);
		req.payload = value;
		next();
	} catch (err) {
		return errorFunction(res, 406, `Error in User Data : ${err.message}`);
	}
};

const deleteCommentValidator = async (req, res, next) => {
	const validator = joi.object({
		target: joi.string().required(),
		user: joi.string().required(),
	});

	const payload = {
		target: req.body.target,
		user: req.user._id,
	};

	try {
		const value = await validator.validateAsync(payload);
		req.payload = value;
		next();
	} catch (err) {
		return errorFunction(res, 406, `Error in User Data : ${err.message}`);
	}
};

const getCommentsValidator = async (req, res, next) => {
	const validator = joi.object({
		target: joi.string(),
		user: joi.string(),
		page: joi.number().default(1),
		limit: joi.number().default(10),
	});

	const payload = {
		target: req.query.target,
		user: req.user._id,
		page: req.query.page && parseInt(req.query.page),
		limit: req.query.limit && parseInt(req.query.limit),
	};

	try {
		const value = await validator.validateAsync(payload);
		req.payload = value;
		next();
	} catch (err) {
		console.log(err);
		return errorFunction(res, 406, `Error in User Data : ${err.message}`);
	}
};

const likeCommentValidator = async (req, res, next) => {
	const validator = joi.object({
		user: joi.string().required(),
		target: joi.string().required(),
	});

	const payload = {
		user: req.user._id,
		target: req.query.target,
	};

	try {
		const value = await validator.validateAsync(payload);
		req.target = value.target;
		req.user = value.user;
		next();
	} catch (err) {
		console.log(err);
		return errorFunction(res, 406, `Error in User Data : ${err.message}`);
	}
};

module.exports = {
	addCommentValidator,
	editCommentValidator,
	deleteCommentValidator,
	getCommentsValidator,
	likeCommentValidator,
};

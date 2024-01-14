const joi = require("joi")
const _ = require("lodash")
const sanitizeHtml = require("sanitize-html")
const errorFunction = require("../../Helpers/errorFunction")

const addPostValidator = async (req, res, next) => {
	const validator = joi.object({
		author: joi.string().required(),
		title: joi.string().required(),
		banner: joi.optional(),
		description: joi.string().required(),
		content: joi.string().required(),
		likes: joi.array().items(joi.string()).default([]),
		comments: joi.array().items(joi.string()).default([]),
		tags: joi.array().items(joi.string()).default([]),
	})

	console.log("req: ", req.banner)
	const payload = {
		author: req.user._id,
		title: req.body.title,
		banner: req.file,
		description: req.body.description,
		content: req.body.content,
		likes: req.body.likes,
		comments: req.body.comments,
		tags: JSON.parse(req.body.tags),
	}
	console.log(req.files)

	try {
		const value = await validator.validateAsync(payload)
		value.content = sanitizeHtml(value.content)
		req.payload = value
		next()
	} catch (err) {
		return errorFunction(res, 406, `Error in User Data : ${err.message}`)
	}
}

const editPostValidator = async (req, res, next) => {
	const validator = joi.object({
		user: joi.string().required(),
		target: joi.string().required(),
		title: joi.string(),
		banner: joi.string(),
		description: joi.string(),
		content: joi.string().custom((value, helpers) => {
			const sanitizedContent = sanitizeHtml(value)
			if (sanitizedContent !== value) {
				return helpers.error("any.invalid")
			}
			return sanitizedContent
		}),
		likes: joi.array().items(joi.string()),
		comments: joi.array().items(joi.string()),
		tags: joi.array().items(joi.string()),
	})

	const selectedProperties = _.pick(req.body, [
		"title",
		"content",
		"banner",
		"description",
		"content",
		"likes",
		"comments",
		"tags",
	])

	console.log(selectedProperties)

	const payload = {
		user: req.user._id,
		target: req.query.target,
		...selectedProperties,
	}

	try {
		const value = await validator.validateAsync(payload)
		req.payload = value
		req.target = value.target
		req.user = value.user
		delete value.target
		delete value.user
		next()
	} catch (err) {
		console.log(err)
		return errorFunction(res, 406, `Error in User Data : ${err.message}`)
	}
}

const getAllPostsValidator = async (req, res, next) => {
	const validator = joi.object({
		target: joi.string(),
		user: joi.string(),
		search: joi.string().default("").empty(""),
		page: joi.number().default(1),
		limit: joi.number().default(10),
	})

	const payload = {
		target: req.query.target,
		user: req.user?._id,
		search: req.query.search,
		page: req.query.page && parseInt(req.query.page),
		limit: req.query.limit && parseInt(req.query.limit),
	}

	try {
		const value = await validator.validateAsync(payload)
		req.payload = value
		next()
	} catch (err) {
		console.log(err)
		return errorFunction(res, 406, `Error in User Data : ${err.message}`)
	}
}

const deletePostValidator = async (req, res, next) => {
	const validator = joi.object({
		user: joi.string().required(),
		target: joi.string().required(),
	})

	const payload = {
		user: req.user._id,
		target: req.query.target,
	}

	try {
		const value = await validator.validateAsync(payload)
		req.target = value.target
		req.user = value.user
		next()
	} catch (err) {
		console.log(err)
		return errorFunction(res, 406, `Error in User Data : ${err.message}`)
	}
}

const likePostValidator = async (req, res, next) => {
	const validator = joi.object({
		user: joi.string().required(),
		target: joi.string().required(),
	})

	const payload = {
		user: req.user._id,
		target: req.query.target,
	}

	try {
		const value = await validator.validateAsync(payload)
		req.target = value.target
		req.user = value.user
		next()
	} catch (err) {
		console.log(err)
		return errorFunction(res, 406, `Error in User Data : ${err.message}`)
	}
}

module.exports = {
	addPostValidator,
	editPostValidator,
	deletePostValidator,
	getAllPostsValidator,
	likePostValidator,
}

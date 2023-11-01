const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: "post",
			},
		],
		saved: [
			{
				type: Schema.Types.ObjectId,
				ref: "post",
			},
		],
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("user", userSchema);

const validate = (user) => {
	const schema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	});
	return schema.validate(user);
};

exports.User = User;
exports.validate = validate;

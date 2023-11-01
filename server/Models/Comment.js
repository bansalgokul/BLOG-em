const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const commentSchema = new Schema(
	{
		message: {
			type: String,
			required: true,
		},
		post: {
			type: Schema.Types.ObjectId,
			ref: "post",
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "user",
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "user",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model("comment", commentSchema);

commentSchema.pre("deleteOne", async (next) => {
	const commentID = this._id;

	try {
		const postID = this.post;
		if (postID) {
			await Post.updateOne({ _id: postID }, { $pull: { comments: commentID } });
		}
		next();
	} catch (err) {
		next(err);
	}
});

const validate = (comment) => {
	// const schema = Joi.object({
	// 	message: Joi.string().required(),
	// 	email: Joi.string().email().required(),
	// 	password: Joi.string().required(),
	// });
	// return schema.validate(user);
};

module.exports = {
	Comment,
	validate,
};

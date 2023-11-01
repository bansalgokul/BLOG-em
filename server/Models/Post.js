const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const { User } = require("./User");
const { Comment } = require("./Comment");

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		banner: {
			type: String,
			required: true,
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "comment",
			},
		],
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
		tags: [{ type: String }],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("post", postSchema);

postSchema.pre("deleteOne", async (next) => {
	const postID = this._id;

	try {
		await Comment.deleteMany({ post: this._id });

		const authorID = this.author;
		if (authorID) {
			await User.updateOne(
				{ _id: authorID },
				{ $pull: { posts: postID } }
			);
		}
		next();
	} catch (err) {
		next(err);
	}
});

module.exports = {
	Post,
};

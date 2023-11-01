const mongoose = require("mongoose");

const { Comment } = require("../Models/Comment");
const { Post } = require("../Models/Post");

const addComment = async (req, res) => {
	const payload = req.payload;

	try {
		const postDoc = await Post.findById(payload.post);
		if (!postDoc) {
			return res.status(404).json({
				status: "failed",
				error: "Post not found",
			});
		}

		const commentDoc = await Comment.create(payload);

		postDoc.comments.push(commentDoc._id);
		postDoc.save();

		return res.status(201).json({
			status: "successful",
			message: "Added comment successfully",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

const deleteComment = async (req, res) => {
	const { target, user } = req.payload;

	try {
		const commentDoc = await Comment.findById(target);
		if (!commentDoc) {
			return res.status(404).json({
				status: "failed",
				error: "Comment Not Found",
			});
		}

		if (commentDoc.author.toString() !== user) {
			return res.status(401).json({
				status: "failed",
				error: "User unauthorized to delete this comment",
			});
		}

		const postDoc = await Post.findById(commentDoc.post);

		postDoc.comments = postDoc.comments.filter(
			(comment) => comment.toString() !== commentDoc._id.toString()
		);
		postDoc.save();
		commentDoc.deleteOne();

		return res.status(200).json({
			status: "successful",
			message: "Deleted comment successfully",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

const editComment = async (req, res) => {
	const { target, message, user } = req.payload;

	try {
		const commentDoc = await Comment.findById(target);
		if (!commentDoc) {
			return res.status(404).json({
				status: "failed",
				error: "Comment not found",
			});
		}

		if (commentDoc.author.toString() !== user) {
			return res.status(401).json({
				status: "failed",
				error: "User unauthorized to edit this comment",
			});
		}

		commentDoc.message = message;
		commentDoc.save();

		return res.status(200).json({
			status: "successful",
			message: "Edited comment successfully",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

const getComments = async (req, res) => {
	// message, postID, authorID, author username, like count, likedByUser, id, timestamps
	const { target, page, limit, user } = req.payload;

	try {
		const postDoc = await Post.findById(target);
		if (!postDoc) {
			return res.status(404).json({
				status: "failed",
				error: "Post not found",
			});
		}

		const skip = (page - 1) * limit;

		const commentsData = await Comment.aggregate([
			{
				$match: {
					post: postDoc._id,
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "author",
					foreignField: "_id",
					as: "authorInfo",
				},
			},
			{
				$unwind: {
					path: "$authorInfo",
				},
			},
			{
				$addFields: {
					authorUsername: "$authorInfo.username",
					authorId: "$authorInfo._id",
				},
			},
			{
				$project: {
					_id: 1,
					message: 1,
					createdAt: 1,
					updatedAt: 1,
					post: 1,
					authorUsername: 1,
					authorId: 1,
					likedByUser: {
						$in: [new mongoose.Types.ObjectId(user), "$likes"],
					},
					likesCount: { $size: "$likes" },
				},
			},
			{ $sort: { createdAt: -1 } },
			{
				$facet: {
					paginatedResults: [{ $skip: skip }, { $limit: limit }],
					totalCount: [{ $group: { _id: null, count: { $sum: 1 } } }],
				},
			},
		]);

		const totalCount =
			commentsData[0].totalCount.length > 0
				? commentsData[0].totalCount[0].count
				: 0;

		const paginatedResults = commentsData[0].paginatedResults;

		return res.status(200).json({
			status: "successful",
			message: "Fetched all comments",
			data: paginatedResults,
			count: totalCount,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

const likeComment = async (req, res) => {
	const user = req.user;
	const target = req.target;
	try {
		const commentDoc = await Comment.findById(target);
		if (!commentDoc) {
			return res.status(404).json({
				status: "failed",
				error: "Comment not found",
			});
		}

		if (
			commentDoc.likes.find((like) => like.toString() === user.toString())
		) {
			commentDoc.likes = commentDoc.likes.filter(
				(like) => like.toString() !== user.toString()
			);
			commentDoc.save();

			return res.status(200).json({
				status: "successful",
				message: "Unliked comment",
			});
		}

		commentDoc.likes.push(new mongoose.Types.ObjectId(user));
		commentDoc.save();

		return res.status(200).json({
			status: "successful",
			message: "Liked comment",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};
module.exports = {
	addComment,
	deleteComment,
	editComment,
	likeComment,
	getComments,
};

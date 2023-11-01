// add post
// edit post
// delete post
// get posts
// like post

const mongoose = require("mongoose");
require("dotenv").config();
const crypto = require("crypto");
const {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { User } = require("../Models/User.js");
const { Post } = require("../Models/Post.js");
const deleteBanner = require("../Helpers/bannerHelper.js");

const s3 = new S3Client({
	credentials: {
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
	},
	region: process.env.BUCKET_LOCATION,
});

const randomImageName = (bytes = 32) =>
	crypto.randomBytes(bytes).toString("hex");

const addPost = async (req, res, next) => {
	const payload = req.payload;
	const banner = payload.banner;
	const imageName = randomImageName();
	const params = {
		Bucket: process.env.BUCKET_NAME,
		Key: imageName,
		Body: banner.buffer,
		ContentType: banner.mimetype,
	};
	try {
		const command = new PutObjectCommand(params);
		await s3.send(command);

		const userDoc = await User.findById(payload.author);
		const postDoc = await Post.create({ ...payload, banner: imageName });
		userDoc.posts.push(postDoc._id);
		userDoc.save();
		return res.status(201).json({
			status: "success",
			message: "Post created successfully",
			post: postDoc,
		});
	} catch (err) {
		console.log(err);
		const command = new DeleteObjectCommand({
			Bucket: params.Bucket,
			Key: params.Key,
		});
		await s3.send(command);
	}
};

const updateUserPostsArray = async (userDoc, updatedPost) => {
	const index = userDoc.posts.findIndex((post) =>
		post._id.equals(updatedPost._id)
	);
	if (index !== -1) {
		userDoc.posts[index] = updatedPost;
		await userDoc.save();
	}
};

const editPost = async (req, res, next) => {
	const payload = req.payload;
	const target = req.target;
	const user = req.user;

	try {
		const userDoc = await User.findById(user);
		let postDoc = await Post.findById(target);

		if (!postDoc) {
			return res.status(404).json({
				status: "failed",
				error: "Post not found",
			});
		}

		if (postDoc.author.toString() !== user) {
			return res.status(401).json({
				status: "failed",
				error: "User not authorized to edit this post.",
			});
		}

		if (payload.banner !== postDoc.banner) {
			const command = new DeleteObjectCommand({
				Bucket: process.env.BUCKET_NAME,
				Key: postDoc.banner,
			});
			await s3.send(command);
		}

		const imageName = randomImageName();
		const params = {
			Bucket: process.env.BUCKET_NAME,
			Key: imageName,
			Body: banner.buffer,
			ContentType: banner.mimetype,
		};
		const command = new PutObjectCommand(params);
		await s3.send(command);

		const updatedPostDoc = await Post.findByIdAndUpdate(target, {
			...payload,
			banner:
				payload.banner !== postDoc.banner ? imageName : postDoc.banner,
		});
		updateUserPostsArray(userDoc, updatedPostDoc);

		return res.status(200).json({
			status: "success",
			message: "Post edit successfully",
		});
	} catch (err) {
		console.error(err);
	}
};

const deletePost = async (req, res) => {
	const target = req.target;
	const user = req.user;

	try {
		const postDoc = await Post.findById(target);
		if (!postDoc) {
			return res.status(404).json({
				status: "failed",
				error: "Post not found",
			});
		}

		if (postDoc.author.toString() !== user) {
			return res.status(401).json({
				status: "failed",
				error: "User not authorized to delete this post.",
			});
		}

		const command = new DeleteObjectCommand({
			Bucket: process.env.BUCKET_NAME,
			Key: postDoc.banner,
		});
		await s3.send(command);

		await Post.deleteOne({ _id: target });

		return res.status(200).json({
			status: "successful",
			message: "Post deleted successfully",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

const getAllPosts = async (req, res) => {
	const { target, search, page, limit } = req.payload;

	try {
		if (target) {
			return getPost(req, res);
		}

		const searchRegex = new RegExp(search, "i");
		const skip = (page - 1) * limit;

		const postsData = await Post.aggregate([
			{
				$match: {
					title: { $regex: searchRegex },
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
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					description: 1,
					banner: 1,
					createdAt: 1,
					updatedAt: 1,
					authorUsername: 1,
					commentsCount: { $size: "$comments" },
					likesCount: { $size: "$likes" },
					tags: 1,
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
			postsData[0].totalCount.length > 0
				? postsData[0].totalCount[0].count
				: 0;

		const paginatedResults = postsData[0].paginatedResults;

		for (const post of paginatedResults) {
			const getObjectParams = {
				Bucket: process.env.BUCKET_NAME,
				Key: post.banner,
			};

			const command = new GetObjectCommand(getObjectParams);
			const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

			post.bannerURL = url;
		}

		return res.status(200).json({
			status: "successful",
			message: "Fetched all posts",
			posts: paginatedResults,
			totalPosts: totalCount,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

const getPost = async (req, res) => {
	const { target, user } = req.payload;

	try {
		const postData = await Post.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(target),
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
					authorId: user,
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					content: 1,
					banner: 1,
					createdAt: 1,
					updatedAt: 1,
					authorUsername: 1,
					authorId: 1,
					commentsCount: { $size: "$comments" },
					likesCount: { $size: "$likes" },
					likedByUser: {
						$in: [
							new mongoose.Types.ObjectId(user || null),
							"$likes",
						],
					},
					tags: 1,
				},
			},
		]);

		if (postData.length === 0) {
			return res.status(404).json({
				status: "failed",
				error: "Post Not Found",
			});
		}

		const postDoc = postData.length > 0 ? postData[0] : [];

		const getObjectParams = {
			Bucket: process.env.BUCKET_NAME,
			Key: postDoc.banner,
		};

		const command = new GetObjectCommand(getObjectParams);
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

		postDoc.bannerURL = url;

		return res.status(200).json({
			status: "successful",
			message: "Post retrieved successfully",
			post: postDoc,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

const likePost = async (req, res) => {
	const user = req.user;
	const { target } = req.query;

	try {
		const postDoc = await Post.findById(target);
		if (!postDoc) {
			return res.status(404).json({
				status: "failed",
				error: "Post not found",
			});
		}

		if (postDoc.likes.find((like) => like.toString() === user.toString())) {
			postDoc.likes = postDoc.likes.filter(
				(like) => like.toString() !== user.toString()
			);
			postDoc.save();

			return res.status(200).json({
				status: "successful",
				message: "Unliked post",
			});
		}

		postDoc.likes.push(new mongoose.Types.ObjectId(user));
		postDoc.save();

		return res.status(200).json({
			status: "successful",
			message: "Liked post",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

module.exports = {
	addPost,
	editPost,
	deletePost,
	getAllPosts,
	getPost,
	likePost,
};

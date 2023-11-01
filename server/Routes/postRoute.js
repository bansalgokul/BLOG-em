const express = require("express");
const verifyJWT = require("../Middlewares/verifyJWT.js");
const decodeToken = require("../Middlewares/decodeToken.js");

const postController = require("../Controllers/postController.js");
const uploadImage = require("../Middlewares/uploadImage.js");
const PostValidator = require("../Middlewares/Validators/postValidator.js");

const router = express.Router();

router.get(
	"/",
	decodeToken,
	PostValidator.getAllPostsValidator,
	postController.getAllPosts
);

router.use(verifyJWT);

router
	.route("/")
	.post(
		uploadImage.single("banner"),
		PostValidator.addPostValidator,
		postController.addPost
	)
	.put(
		uploadImage.single("banner"),
		PostValidator.editPostValidator,
		postController.editPost
	)
	.delete(PostValidator.deletePostValidator, postController.deletePost);

router.post("/like", PostValidator.likePostValidator, postController.likePost);

module.exports = router;

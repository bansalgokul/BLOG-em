const express = require("express");
const verifyJWT = require("../Middlewares/verifyJWT.js");
const decodeToken = require("../Middlewares/decodeToken.js");

const commentController = require("../Controllers/commentController.js");
const CommentValidator = require("../Middlewares/Validators/commentValidator.js");

const router = express.Router();

router.get(
	"/",
	decodeToken,
	CommentValidator.getCommentsValidator,
	commentController.getComments
);

router.use(verifyJWT);

router
	.route("/")
	.post(CommentValidator.addCommentValidator, commentController.addComment)
	.put(CommentValidator.editCommentValidator, commentController.editComment)
	.delete(
		CommentValidator.deleteCommentValidator,
		commentController.deleteComment
	);

router.post(
	"/like",
	CommentValidator.likeCommentValidator,
	commentController.likeComment
);

module.exports = router;

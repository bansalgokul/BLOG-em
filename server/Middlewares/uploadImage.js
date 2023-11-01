const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

	if (!allowedTypes.includes(file.mimetype)) {
		return cb(null, false);
	}

	cb(null, true);
};

const uploadImage = multer({ fileFilter, storage });
module.exports = uploadImage;

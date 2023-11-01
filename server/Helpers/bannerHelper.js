const path = require("path");
const fs = require("fs");

const deleteBanner = (banner) => {
	const filePath = path.join(__dirname, "/..", "/public/banner", banner);
	fs.unlink(filePath, (err) => {
		if (err) throw err;
		console.log(filePath, " was deleted");
	});
};

module.exports = deleteBanner;

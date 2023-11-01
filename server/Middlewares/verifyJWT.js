const jwt = require("jsonwebtoken");
const { User } = require("../Models/User");

const verifyJWT = async (req, res, next) => {
	const bearerHeader =
		req.headers["authorization"] || req.headers["Authorization"];

	if (!bearerHeader) {
		return res.status(401).json({
			status: "failed",
			error: "No Token",
		});
	}

	const bearer = bearerHeader.split(" ");
	const bearerToken = bearer[1];

	try {
		const decoded = jwt.verify(
			bearerToken,
			process.env.ACCESS_TOKEN_SECRET
		);

		const userDoc = await User.findById(decoded._id);

		if (!userDoc) {
			return res.status(401).json({
				status: "failed",
				error: "Invalid access token",
			});
		}

		req.user = decoded;
		next();
	} catch (err) {
		console.error(err);
		return res.status(401).json({
			status: "failed",
			error: "Invalid access token",
		});
	}
};

module.exports = verifyJWT;

const jwt = require("jsonwebtoken");
const generateAccessToken = (data) => {
	const payload = {
		_id: data._id,
		username: data.username,
		email: data.email,
	};
	const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
	});
	return accessToken;
};
const setRefreshToken = (data, res) => {
	const payload = {
		_id: data._id,
		username: data.username,
		email: data.email,
	};
	const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
	});
	res.cookie("jwt", refreshToken, {
		httpOnly: true,
		sameSite: "None",
		secure: true,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	return;
};
const clearRefreshToken = (res) => {
	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "None",
		secure: true,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	return;
};
exports.generateAccessToken = generateAccessToken;
exports.setRefreshToken = setRefreshToken;
exports.clearRefreshToken = clearRefreshToken;

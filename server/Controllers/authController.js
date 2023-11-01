// register
// login
// refresh access token
// logout
// can also increase security by maintaining a blacklist of invalidated tokens on the server or using a technique like token versioning.
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../Models/User.js");
const {
	generateAccessToken,
	setRefreshToken,
	clearRefreshToken,
} = require("../Helpers/tokenHelper.js");

const register = async (req, res) => {
	const { username, email, password } = req.body;
	// console.log(req.body);
	if (!username || !email || !password) {
		return res.status(400).json({
			status: "failed",
			error: "Missing required fields",
		});
	}

	try {
		const userDoc = await User.find({
			$or: [
				{
					username,
				},
				{
					email,
				},
			],
		});
		if (userDoc.length > 0) {
			return res.status(409).json({
				status: "failed",
				error: "Account with username or email already exists.",
			});
		}
		const salt = bcryptjs.genSaltSync(10);
		const hash = bcryptjs.hashSync(password, salt);
		const newUser = {
			username,
			email,
			password: hash,
			posts: [],
			saved: [],
		};
		await User.create(newUser);
		return res.status(201).json({
			status: "success",
			message: "User registered successfully",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	// check if account with email exists
	// err -> user does not exist
	try {
		const userDoc = await User.findOne({
			email,
		}).select("+password");

		if (!userDoc) {
			return res.status(404).json({
				status: "failed",
				error: "Account doesn't exists.",
			});
		}

		// compare password
		// err -> wrong password
		const comparePassword = bcryptjs.compareSync(
			password,
			userDoc.password
		);
		if (!comparePassword) {
			return res.status(401).json({
				status: "failed",
				error: "Wrong Password",
			});
		}

		// create access and refresh token
		// return access token and set refresh token as http cookie

		const accessToken = generateAccessToken(userDoc);
		setRefreshToken(userDoc, res);

		return res.status(200).json({
			status: "successful",
			message: "Login successful",
			token: accessToken,
			data: {
				username: userDoc.username,
				email: userDoc.email,
				_id: userDoc._id,
			},
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

const refreshAccessToken = async (req, res) => {
	const { jwt: refreshToken } = req.cookies;
	if (!refreshToken) {
		return res.status(401).json({
			status: "failed",
			error: "invalid refresh token",
		});
	}

	try {
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, decoded) => {
				if (err) {
					return res.status(401).json({
						status: "failed",
						error: "invalid refresh token",
					});
				}
				const userDoc = await User.findById(decoded._id);
				const accessToken = generateAccessToken(userDoc);
				return res.status(200).json({
					status: "successful",
					message: "Refresh successful",
					token: accessToken,
				});
			}
		);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

const logout = async (req, res) => {
	const { jwt: refreshToken } = req.cookies;
	if (!refreshToken) {
		return res.status(200).json({
			status: "successful",
			message: "logout successful",
		});
	}
	clearRefreshToken(res);
	return res.status(200).json({
		status: "successful",
		message: "logout successful",
	});
};

const forgotPassword = async (req, res) => {
	// enter email
	// send mail with link with user id and token for verification
	// save new password
};

const changePassword = async (req, res) => {
	const { _id } = req.user;
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		return res.status(400).json({
			status: "failed",
			error: "Missing required fields",
		});
	}

	try {
		const userDoc = await User.findById(_id).select("+password");

		const comparePassword = bcryptjs.compareSync(
			oldPassword,
			userDoc.password
		);
		if (!comparePassword) {
			return res.status(401).json({
				status: "failed",
				error: "Wrong Password",
			});
		}

		const salt = bcryptjs.genSaltSync(10);
		const hash = bcryptjs.hashSync(newPassword, salt);

		userDoc.password = hash;
		userDoc.save();

		return res.status(200).json({
			status: "successful",
			error: "Changed password successfully",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};

const accessPrivateRoute = async (req, res) => {
	const user = req.user;

	return res.status(200).json({
		status: "successful",
		message: "Access to private route granted",
		data: user,
	});
};

module.exports = {
	register,
	login,
	refreshAccessToken,
	logout,
	forgotPassword,
	changePassword,
	accessPrivateRoute,
};

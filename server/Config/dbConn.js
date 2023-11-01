const mongoose = require("mongoose");

const dbConn = async () => {
	try {
		const connectionParams = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};
		await mongoose.connect(process.env.DB, connectionParams);
		console.log("connected to database.");
	} catch (error) {
		console.error(error, "could not connect database.");
	}
};

module.exports = dbConn;

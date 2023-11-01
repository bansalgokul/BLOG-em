const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const path = require("path");

const dbConn = require("./Config/dbConn.js");
const indexRoute = require("./Routes/indexRoute.js");
const fs = require("fs");

const PORT = process.env.PORT || 4000;
const app = express();
dotenv.config();

dbConn();

const corsOptions = {
	origin: [
		// "http://localhost:4173",
		// "http://localhost:5173",
		"https://blog-em.vercel.app",
	],
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", indexRoute);
app.use(express.static(path.join(__dirname, "public")));

app.use((err, req, res, next) => {
	console.error(err); // Log the error to the console or save it to a log file.
	res.status(500).json({ error: "Internal Server Error" }); // Respond with an error message to the client.
});

process.on("uncaughtException", (error) => {
	console.error("Uncaught Exception:", error);
	// Optionally, you can perform cleanup or graceful shutdown here.
	process.exit(1); // Exit the application with an error code (1).
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));

const express = require("express");

const postRoute = require("./postRoute.js");
const userRoute = require("./userRoute.js");
const commentRoute = require("./commentRoute.js");
const authRoute = require("./authRoute.js");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/post", postRoute);
router.use("/comment", commentRoute);
router.use("/user", userRoute);

module.exports = router;

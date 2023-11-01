const express = require("express");
const verifyJWT = require("../Middlewares/verifyJWT.js");
const authController = require("../Controllers/authController.js");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh", authController.refreshAccessToken);
router.post("/logout", authController.logout);

router.use(verifyJWT);

router.post("/change", authController.changePassword);
router.get("/private", authController.accessPrivateRoute);

module.exports = router;

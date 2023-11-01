const express = require("express");
const userController = require("../Controllers/userController.js");

const router = express.Router();

router.post("/save", userController.savePost);
router.put("/", userController.editProfile);

module.exports = router;

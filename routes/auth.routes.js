const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const loginLimiter = require("../middleware/loginLimiter");
const signupLimiter = require("../middleware/signupLimiter");

router.route("/").post(loginLimiter, authController.login);

router.route("/signup").post(signupLimiter, authController.signup);

router.route("/refresh").get(authController.refresh);

router.route("/logout").post(authController.logout);

module.exports = router;

const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/request-password-change", authController.requestPasswordChange);
router.post("/change-password", authController.changePassword);
router.post("/verify-email", authController.verifyEmail);

module.exports = router;

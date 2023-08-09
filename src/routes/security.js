const express = require("express");
const securityController = require("../controllers/security");

const router = express.Router();

router.post("/verifyToken", securityController.verifyToken);

module.exports = router;

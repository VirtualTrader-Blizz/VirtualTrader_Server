const express = require("express");
const cryptoController = require("../controllers/crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

const verifyToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token || token === null) {
    req.isValid = false;
    next();
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      req.isValid = false;
      next();
    }

    const myUser = await User.findUserByEmail(decoded.email);
    req.isValid = true;
    req.user = myUser;
    next();
  });
};

router.post("/getcryptos", verifyToken, cryptoController.getCryptos);

module.exports = router;

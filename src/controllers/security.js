const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.verifyToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token || token === null) {
    return res.status(403).json({ message: "Token requis" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }

    const myUser = await User.findUserByEmail(decoded.email);

    res
      .status(200)
      .json({ message: "Token valide", nickname: myUser[0][0].username });
  });
};

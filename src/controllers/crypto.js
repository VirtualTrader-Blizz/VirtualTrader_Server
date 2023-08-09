const crypto = require("../models/crypto");

exports.getCryptos = async (req, res, next) => {
  if (!req.isValid) {
    return res.status(401).json({ message: "Token invalid" });
  }

  const cryptos = await crypto.getAllCrypto();

  return res.status(200).json({ cryptos: cryptos[0] });
};

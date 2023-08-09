const db = require("../utils/db");

exports.getAllCrypto = () => {
  return db.execute("SELECT * FROM `stocks` WHERE 1");
};

const db = require("../utils/db");

exports.findPortfolioByUserId = (id) => {
  return db.execute("SELECT * FROM portfolios WHERE user_id = ?", [id]);
};

exports.createPortfolioByUserId = (id) => {
  return db.execute("INSERT INTO portfolios(user_id, balance) VALUES (?, ?)", [
    id,
    100,
  ]);
};

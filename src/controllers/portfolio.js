const portfolio = require("../models/portfolio");

exports.createPorfolio = async (req, res, next) => {
  if (!req.isValid) {
    return res.status(401).json({ message: "Token invalid" });
  }

  const user = req.user[0][0];
  let userPortfolio = await portfolio.findPortfolioByUserId(user.user_id);
  userPortfolio = userPortfolio[0][0];

  if (userPortfolio === undefined) {
    await portfolio
      .createPortfolioByUserId(user.user_id)
      .catch((error) => console.log(error));
  }

  userPortfolio = await portfolio.findPortfolioByUserId(user.user_id);
  userPortfolio = userPortfolio[0][0];

  return res.status(200).json({ balance: userPortfolio.balance });
};

exports.getBalance = async (req, res, next) => {
  if (!req.isValid) {
    return res.status(401).json({ message: "Token invalid" });
  }

  const user = req.user[0][0];
  let userPortfolio = await portfolio.findPortfolioByUserId(user.user_id);
  userPortfolio = userPortfolio[0][0];

  res.status(200).json({ balance: userPortfolio.balance });
};

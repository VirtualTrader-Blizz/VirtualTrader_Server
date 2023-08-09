const db = require("../utils/db");

exports.createUser = (username, email, password_hash) => {
  return db.execute(
    "INSERT INTO users (username, email, password_hash, isVerify) VALUES (?, ?, ?, ?)",
    [username, email, password_hash, false]
  );
};

exports.findUserByEmail = (email) => {
  return db.execute("SELECT * FROM users WHERE email = ?", [email]);
};

exports.updatePassword = (email, password_hash) => {
  return db.execute("UPDATE users SET password_hash = ? WHERE email = ?", [
    password_hash,
    email,
  ]);
};

exports.updateVerify = (isVerify, userID) => {
  return db.execute("UPDATE users SET isVerify = ? WHERE user_id = ?", [
    isVerify,
    userID,
  ]);
};

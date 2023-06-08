const jwt = require("jsonwebtoken");

const createToken = (id) =>
  jwt.sign({ userid: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });

module.exports = createToken;

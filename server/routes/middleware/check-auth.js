const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["token"];
  try {
    let decoded = await jwt.verify(token, config.SECRET_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    next(new ResponseException(error.message, 401));
  }
};

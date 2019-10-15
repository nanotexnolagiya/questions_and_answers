const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["token"];
  try {
    let decoded = jwt.verify(token, config.SECRET_KEY);

    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Unauthorizated"
    });
  }
};

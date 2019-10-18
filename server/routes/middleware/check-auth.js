const jwt = require("jsonwebtoken");
const config = require("../../config");
const { Users } = require("../../models");

module.exports = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["token"];
  try {
    let decoded = await jwt.verify(token, config.SECRET_KEY);
    const user = await Users.findOne({
      where: {
        id: decoded.userId
      }
    })

    if(!user) throw new Error('Unauthorizated') 

    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      ok: false,
      message: "Unauthorizated"
    });
  }
};

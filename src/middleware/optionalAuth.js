const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function optionalAuth(req, res, next) {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).select("-passwordHash");

    if (user) {
      req.user = user;
    }

    next();
  } catch (err) {
    next();
  }
};
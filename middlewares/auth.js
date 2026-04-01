const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * =========================
 * AUTHENTICATION MIDDLEWARE
 * =========================
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

/**
 * =========================
 * AUTHORIZATION MIDDLEWARE
 * =========================
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
};

/**
 * =========================
 * EXPORT (MOST IMPORTANT)
 * =========================
 */
module.exports = {
  authenticate,
  authorize,
};
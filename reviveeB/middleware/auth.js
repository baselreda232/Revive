const jwt = require("jsonwebtoken");

// Authentication middleware
const authenticate = (req, res, next) => {
  // Check for token in cookie first, then Authorization header
  const token = req.cookies.jwt || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin authorization middleware
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.adminInfo?.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Customer authorization middleware
const customerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Customer access required" });
  }
  
  if (!req.user.customerInfo) {
    return res.status(403).json({ message: "Customer access required" });
  }
  
  if (req.user.customerInfo.role !== 'customer') {
    return res.status(403).json({ message: "Customer access required" });
  }
  
  next();
};

// Inspector authorization middleware
const inspectorOnly = (req, res, next) => {
  if (!req.user || !req.user.inspectorInfo?.role !== 'inspector') {
    return res.status(403).json({ message: "Inspector access required" });
  }
  next();
};

module.exports = {
  authenticate,
  adminOnly,
  customerOnly,
  inspectorOnly
};

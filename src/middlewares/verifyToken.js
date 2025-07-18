import jwt from "jsonwebtoken";
import Admin from "../model/adminModel.js";

const authenticateAdmin = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find admin and attach to request
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    let message = "Invalid or expired token";
    if (error.name === "TokenExpiredError") {
      message = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token";
    }
    return res.status(401).json({
      success: false,
      message,
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    next();
  };
};

export { authenticateAdmin, authorizeRoles };

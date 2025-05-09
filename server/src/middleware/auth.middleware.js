import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import env from "../config/index.js";

/**
 * Middleware to verify JWT from cookies and forward user details to the next method.
 */
const verifyJWT = (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Access token is missing");
  }

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Forward user details to the next method
    next();
  } catch (err) {
    throw next(new ApiError(403, "Invalid or expired access token"));
  }
};

export default verifyJWT;

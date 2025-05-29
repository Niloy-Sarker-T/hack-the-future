// import mongoose from "mongoose";

import logger from "../logger/winston.logger.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

/**
 *
 * @param {Error | ApiError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 *
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Drizzle unique constraint error
  if (err.code === "23505") {
    const message = "Duplicate field value entered";
    error = new ApiError(400, message);
  }

  // Drizzle foreign key constraint error
  if (err.code === "23503") {
    const message = "Referenced resource not found";
    error = new ApiError(404, message);
  }

  logger.error({
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode || 500,
    method: req.method,
    url: req.originalUrl,
    user: req.user ? req.user.id : "Unauthenticated",
  });

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { errorHandler };

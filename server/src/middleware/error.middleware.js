// import mongoose from "mongoose";

import { drizzle } from "drizzle-orm/node-postgres";
import logger from "../logger/winston.logger.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { DrizzleError } from "drizzle-orm";

/**
 *
 * @param {Error | ApiError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Ensure error is an instance of ApiError for consistency
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error instanceof DrizzleError ? 400 : 500);
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Prepare response object
  const response = {
    success: false,
    message: error.message,
    statusCode: error.statusCode,
    // ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  // Log error message and stack to terminal
  logger.error({
    message: error.message,
    stack: err.stack,
    statusCode: error.statusCode,
    method: req.method,
    url: req.originalUrl,
    user: req.user ? req.user.id : "Unauthenticated",
  });

  if (err?.stack) {
    logger.error(`Error Stack: ${err.stack}`);
  }

  return res.status(error.statusCode).json(response);
};

export { errorHandler };

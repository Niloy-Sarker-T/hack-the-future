import logger from "../logger/winston.logger.js";
import { ApiError } from "../utils/api-error.js";

/**
 * A middleware function that validates the request body against the given schema.
 * If the schema validation is successful, the validated data replaces req.body.
 * If the schema validation fails, throws an ApiError with validation details.
 *
 * @param {import('zod').Schema} schema - The schema to validate the request body against.
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void}
 */
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      let dataToValidate;

      switch (source) {
        case "query":
          dataToValidate = req.query;
          break;
        case "params":
          dataToValidate = req.params;
          break;
        default:
          dataToValidate = req.body;
      }

      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: result.error.errors,
        });
      }

      // Assign validated data back
      if (source === "query") {
        req.query = result.data;
      } else if (source === "params") {
        req.params = result.data;
      } else {
        req.body = result.data;
      }

      next();
    } catch (error) {
      // Handle unexpected errors
      logger.error("Validation middleware error:", error);
      return next(new ApiError(500, "Internal server error"));
    }
  };
};

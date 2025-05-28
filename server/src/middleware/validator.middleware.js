import { ApiError } from "../utils/api-error.js";

/**
 * A middleware function that validates the request body against the given schema.
 * If the schema validation is successful, the validated data replaces req.body.
 * If the schema validation fails, throws an ApiError with validation details.
 *
 * @param {import('zod').Schema} schema - The schema to validate the request body against.
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void}
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      const errorMessages = validation.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      throw new ApiError(422, `Validation failed: ${errorMessages}`);
    }

    // Replace req.body with validated data
    req.body = validation.data;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateQuery = (schema) => (req, res, next) => {
  try {
    const result = schema.parse(req.query);
    req.query = result;
    next();
  } catch (error) {
    const errorMessage = error.errors?.map((err) => err.message).join(", ");
    throw new ApiError(400, `Query validation failed: ${errorMessage}`);
  }
};

export const validateParams = (schema) => (req, res, next) => {
  try {
    const result = schema.parse(req.params);
    req.params = result;
    next();
  } catch (error) {
    const errorMessage = error.errors?.map((err) => err.message).join(", ");
    throw new ApiError(400, `Params validation failed: ${errorMessage}`);
  }
};

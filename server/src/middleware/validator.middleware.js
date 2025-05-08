import { ApiError } from "../utils/api-error";

/**
 * A middleware function that validates the request body against the given schema.
 * If the schema validation is successful, the validated data is stored in
 * req.validatedData. If the schema validation fails, a 400 response is sent back
 * with the validation errors.
 *
 * @param {import('zod').Schema} schema - The schema to validate the request body
 * against.
 *
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void}
 */
export const validate = (schema) => (req, res, next) => {
  const validation = schema.safeParse(req.body);

  return validation.success
    ? ((req.validatedData = validation.data), next())
    : res
        .status(422)
        .json(new ApiError(422, "Validation Error", validation.error.format()));
};

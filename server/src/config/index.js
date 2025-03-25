import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

let envSchema = z.object({
  PORT: z
    .string()
    .nonempty()
    .refine(
      (port) => parseInt(port) > 0 && parseInt(port) < 65536,
      "Invalid port number"
    ),
  CORS_ORIGIN: z
    .string()
    .nonempty()
    .refine(
      (origins) =>
        origins === "*" ||
        origins.split(",").every(
          (origin) => origin.trim().length > 0 && isValidUrl(origin.trim()) // Validate each origin
        ),
      "Invalid CORS origin list. Must be '*' or a comma-separated list of valid URLs."
    )
    .transform((origins) =>
      origins === "*" ? "*" : origins.split(",").map((origin) => origin.trim())
    ),
  REFRESH_TOKEN_SECRET: z.string().nonempty(),
  REFRESH_TOKEN_EXPIRY: z.string().nonempty(),
  ACCESS_TOKEN_SECRET: z.string().nonempty(),
  ACCESS_TOKEN_EXPIRY: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
});

// Helper function to validate URLs
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

let env = envSchema.parse(process.env);

export default env;

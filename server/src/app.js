import express from "express";
import cors from "cors";
import requestIp from "request-ip";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import config from "./config/index.js";

const app = express();

app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(requestIp.mw());

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req, res) => {
    return req.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// * api routes
import { errorHandler } from "./middleware/error.middleware.js";
import healthcheckRouter from "./route/healthcheck.route.js";
import authRouter from "./route/auth.route.js";

// * healthcheck
app.use("/api/healthcheck", healthcheckRouter);
app.use("/api/auth", authRouter);

// * API DOCS
// ? Keeping swagger code at the end so that we can load swagger on "/" route
// app.use(
//   "/",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocument, {
//     swaggerOptions: {
//       docExpansion: "none", // keep all the sections collapsed by default
//     },
//     customSiteTitle: "FreeAPI docs",
//   })
// );

// common error handling middleware
app.use(errorHandler);

export default app;

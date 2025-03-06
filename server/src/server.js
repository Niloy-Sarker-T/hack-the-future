import app from "./app.js";
import config from "./config/index.js";
import logger from "./logger/winston.logger.js";

const port = config.PORT;

const server = app.listen(port, () => {
  logger.info(
    `📑 Visit the documentation at: http://localhost:${
      process.env.PORT || 8080
    }`
  );
  logger.info("⚙️  Server is running on port: " + process.env.PORT);
});

const shutdown = (signal) => {
  console.log(`\nReceived ${signal}. Closing server...`);

  // Force exit if not closed within a timeout
  const timeout = setTimeout(() => {
    logger.warn("Forcefully shutting down...");
    process.exit(1);
  }, 500);

  server.close(() => {
    clearTimeout(timeout);
    logger.info("Server closed.");
    process.exit(0);
  });
};

// Listen for termination signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

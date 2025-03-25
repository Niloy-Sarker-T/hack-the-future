import config from "./src/config/index";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/drizzle",
  schema: "./src/db/schema/index.js",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});

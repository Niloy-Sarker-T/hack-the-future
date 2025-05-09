import pkg from "pg";
import config from "../config/index.js";
import { drizzle } from "drizzle-orm/node-postgres";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export const db = drizzle(pool);

import { Pool } from "pg";
import config from "../config/index";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export const db = drizzle(pool);

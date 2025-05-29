import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

// Users table
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  userName: varchar("user_name", { length: 255 }).unique(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url").default("avatar"),
  location: varchar("location", { length: 255 }).default("--"),
  bio: text("bio").default("--"),
  socialLinks: jsonb("social_links"),
  role: varchar("role", { length: 255 }),
  skills: jsonb("skills").default([]), // Array of skills
  interests: jsonb("interests").default([]), // Array of interests
  isVerified: boolean("is_verified").notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: false }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

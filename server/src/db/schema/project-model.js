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
import { usersTable } from "./users.js";

export const projectsTable = pgTable("user_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .references(() => usersTable.id)
    .notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  images: jsonb("images"),
  videoUrl: varchar("video_url", { length: 500 }),
  isPublic: boolean("is_public").default(true),
  tags: jsonb("tags"),
  likes: integer("likes").default(0),
  demoUrl: varchar("demo_url", { length: 500 }),
  status: varchar("status", { length: 50 }).default("in_progress"), // in_progress, completed, archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// KEEP THIS - Different purpose from hackathon teams
export const projectMatesTable = pgTable("project_mates", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projectsTable.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  role: varchar("role", { length: 50 }).default("collaborator"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

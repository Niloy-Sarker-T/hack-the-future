import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { hackathonsTable } from "./hackathon-model.js";
import { teamsTable } from "./team-model.js";

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
  status: varchar("status", { length: 50 }).default("in_progress"),

  // ADD THESE NEW HACKATHON FIELDS
  hackathonId: uuid("hackathon_id").references(() => hackathonsTable.id),
  teamId: uuid("team_id").references(() => teamsTable.id),
  submissionStatus: varchar("submission_status", { length: 20 }).default(
    "draft"
  ),
  submittedAt: timestamp("submitted_at"),
  repositoryUrl: varchar("repository_url", { length: 500 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Keep your existing collaborators table
export const projectMatesTable = pgTable("project_mates", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projectsTable.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  role: varchar("role", { length: 50 }).default("contributor"),
  addedAt: timestamp("added_at").defaultNow(),
});

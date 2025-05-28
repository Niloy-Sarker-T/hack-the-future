import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { projectsTable } from "./project-model.js";
import { teamsTable } from "./team-model.js";

export const hackathonsTable = pgTable("hackathons", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  theme: varchar("theme", { length: 100 }),
  thumbnail: varchar("thumbnail", { length: 255 }),
  banner: varchar("banner", { length: 255 }),
  status: varchar("status", { length: 50 }).default("upcoming"), // 'draft', 'upcoming', 'ongoing', 'completed'
  maxTeamSize: integer("max_team_size").default(4),
  minTeamSize: integer("min_team_size").default(1),
  allowSoloParticipation: boolean("allow_solo_participation").default(true), // NEW: Allow solo participants
  organizeBy: varchar("organize_by", { length: 255 }).notNull(),
  createdBy: uuid("created_by")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hackathonParticipants = pgTable("hackathon_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  hackathonId: uuid("hackathon_id")
    .references(() => hackathonsTable.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  participationType: varchar("participation_type", { length: 20 }).notNull(), // 'solo' or 'team'
  teamId: uuid("team_id").references(() => teamsTable.id), // NULL for solo participants
  registeredAt: timestamp("registered_at").defaultNow(),
});

export const submissionsTable = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  hackathonId: uuid("hackathon_id")
    .references(() => hackathonsTable.id)
    .notNull(),
  projectId: uuid("project_id")
    .references(() => projectsTable.id)
    .notNull(),
  submittedBy: uuid("submitted_by")
    .references(() => usersTable.id)
    .notNull(),

  // NEW: Either teamId OR individual submission
  teamId: uuid("team_id").references(() => teamsTable.id), // NULL for solo submissions
  participationType: varchar("participation_type", { length: 20 }).notNull(), // 'solo' or 'team'

  submissionNotes: text("submission_notes"),
  isLateSubmission: boolean("is_late_submission").default(false),
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const prizesTable = pgTable("prizes", {
  id: uuid("id").primaryKey().defaultRandom(),
  hackathonId: uuid("hackathon_id").references(() => hackathonsTable.id),
  prizeName: varchar("prize_name", { length: 255 }).notNull(),
  winnerNumber: integer("winner_number").default(1),
  description: varchar("description", { length: 255 }),
});

export const eventsTable = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  hackathonId: uuid("hackathon_id").references(() => hackathonsTable.id),
  eventName: varchar("event_name", { length: 100 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
});

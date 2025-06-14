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
import { projectsTable } from "./project-model.js";
import { teamsTable } from "./team-model.js";

export const hackathonsTable = pgTable("hackathons", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  requirements: text("requirements"),
  judgingCriteria: text("judging_criteria"),
  themes: jsonb("themes"), // <-- Use JSONB for themes array
  thumbnail: varchar("thumbnail", { length: 255 }),
  banner: varchar("banner", { length: 255 }),
  status: varchar("status", { length: 50 }).default("draft"), // 'draft', 'upcoming', 'ongoing', 'completed'
  maxTeamSize: integer("max_team_size").default(4),
  minTeamSize: integer("min_team_size").default(1),
  allowSoloParticipation: boolean("allow_solo_participation").default(true), // NEW: Allow solo participants
  organizeBy: varchar("organize_by", { length: 255 }),
  createdBy: uuid("created_by")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  registrationDeadline: timestamp("registration_deadline"),
  submissionDeadline: timestamp("submission_deadline"),
});

export const hackathonParticipants = pgTable("hackathon_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  hackathonId: uuid("hackathon_id")
    .references(() => hackathonsTable.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  // MAKE SURE this field name matches what you're using in controller
  participationType: varchar("participation_type", { length: 20 }).notNull(),
  teamId: uuid("team_id").references(() => teamsTable.id),
  joinedAt: timestamp("joined_at").defaultNow(),
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
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});

export const judgesTable = pgTable("judges", {
  id: uuid("id").primaryKey().defaultRandom(),
  hackathonId: uuid("hackathon_id").references(() => hackathonsTable.id),
  userId: uuid("user_id").references(() => usersTable.id),
  // if some judges are not part of the users table, what can i do?
  // For example, if judges are external experts not registered on the platform
  // you can use a text field for their email or name
  externalJudgeEmail: varchar("external_judge_email", { length: 255 }),
  role: varchar("role", { length: 50 }).default("judge"), // 'judge', 'mentor', etc.
  assignedAt: timestamp("assigned_at").defaultNow(),
});

export const projectEvaluationsTable = pgTable("project_evaluations", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projectsTable.id)
    .notNull(),
  judgeId: uuid("judge_id")
    .references(() => usersTable.id)
    .notNull(),
  scores: jsonb("scores"), // JSON object with criteria-based scores
  feedback: text("feedback"),
  overallScore: integer("overall_score"), // Overall score out of 100
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

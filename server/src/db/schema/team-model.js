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
import { hackathonsTable } from "./hackathon-model.js";

export const teamsTable = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamName: varchar("team_name", { length: 255 }).notNull(),
  hackathonId: uuid("hackathon_id").references(() => hackathonsTable.id),
  leaderId: uuid("leader_id").references(() => usersTable.id),
  description: text("description"),
  isOpen: boolean("is_open").default(true),
  maxMembers: integer("max_members").default(4),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembersTable = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").references(() => teamsTable.id),
  userId: uuid("user_id").references(() => usersTable.id),
  role: varchar("role", { length: 50 }).default("member"), // leader, member
});

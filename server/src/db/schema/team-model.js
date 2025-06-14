import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  unique,
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamMembersTable = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").references(() => teamsTable.id),
  userId: uuid("user_id").references(() => usersTable.id),
  role: varchar("role", { length: 50 }).default("member"), // leader, member
  joinedAt: timestamp("joined_at").defaultNow(),
});

// ADD: Team Invitations Table
export const teamInvitationsTable = pgTable(
  "team_invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
      .references(() => teamsTable.id)
      .notNull(),
    inviterId: uuid("inviter_id")
      .references(() => usersTable.id)
      .notNull(),
    inviteeId: uuid("invitee_id")
      .references(() => usersTable.id)
      .notNull(),
    status: varchar("status", { length: 20 }).default("pending"), // pending, accepted, declined, expired
    message: text("message"), // Optional invitation message
    invitedAt: timestamp("invited_at").defaultNow(),
    respondedAt: timestamp("responded_at"),
    expiresAt: timestamp("expires_at").notNull(), // Auto-expire invitations
  },
  (table) => ({
    uniqueTeamInvitee: unique().on(table.teamId, table.inviteeId),
  })
);

// ADD: Team Join Requests (for public teams)
export const teamJoinRequestsTable = pgTable(
  "team_join_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
      .references(() => teamsTable.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => usersTable.id)
      .notNull(),
    status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected
    message: text("message"), // Why they want to join
    requestedAt: timestamp("requested_at").defaultNow(),
    respondedAt: timestamp("responded_at"),
  },
  (table) => ({
    uniqueTeamUser: unique().on(table.teamId, table.userId),
  })
);

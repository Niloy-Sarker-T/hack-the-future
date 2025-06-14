CREATE TABLE "team_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"inviter_id" uuid NOT NULL,
	"invitee_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"message" text,
	"invited_at" timestamp DEFAULT now(),
	"responded_at" timestamp,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "team_invitations_team_id_invitee_id_unique" UNIQUE("team_id","invitee_id")
);
--> statement-breakpoint
CREATE TABLE "team_join_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"message" text,
	"requested_at" timestamp DEFAULT now(),
	"responded_at" timestamp,
	CONSTRAINT "team_join_requests_team_id_user_id_unique" UNIQUE("team_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "hackathon_participants" RENAME COLUMN "registered_at" TO "joined_at";--> statement-breakpoint
ALTER TABLE "project_mates" RENAME COLUMN "joined_at" TO "added_at";--> statement-breakpoint
ALTER TABLE "project_mates" ALTER COLUMN "role" SET DEFAULT 'contributor';--> statement-breakpoint
ALTER TABLE "user_projects" ADD COLUMN "hackathon_id" uuid;--> statement-breakpoint
ALTER TABLE "user_projects" ADD COLUMN "team_id" uuid;--> statement-breakpoint
ALTER TABLE "user_projects" ADD COLUMN "submission_status" varchar(20) DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "user_projects" ADD COLUMN "submitted_at" timestamp;--> statement-breakpoint
ALTER TABLE "user_projects" ADD COLUMN "repository_url" varchar(500);--> statement-breakpoint
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_invitee_id_users_id_fk" FOREIGN KEY ("invitee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_join_requests" ADD CONSTRAINT "team_join_requests_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_join_requests" ADD CONSTRAINT "team_join_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_hackathon_id_hackathons_id_fk" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
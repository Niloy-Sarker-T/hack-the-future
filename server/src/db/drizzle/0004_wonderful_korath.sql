ALTER TABLE "team_members" ADD COLUMN "joined_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "updated_at" timestamp DEFAULT now();
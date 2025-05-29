ALTER TABLE "users" RENAME COLUMN "socials_links" TO "social_links";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(255);--> statement-breakpoint
ALTER TABLE "hackathons" ADD COLUMN "thumbnail" varchar(255);--> statement-breakpoint
ALTER TABLE "hackathons" ADD COLUMN "banner" varchar(255);
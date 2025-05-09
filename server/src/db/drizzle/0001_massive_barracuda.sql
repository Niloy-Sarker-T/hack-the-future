ALTER TABLE "user_verifications" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_verifications" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_user_name_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "user_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";
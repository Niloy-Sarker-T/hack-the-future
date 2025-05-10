ALTER TABLE "users" ALTER COLUMN "avatar_url" SET DEFAULT 'avatar';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "bio" SET DEFAULT '--';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");
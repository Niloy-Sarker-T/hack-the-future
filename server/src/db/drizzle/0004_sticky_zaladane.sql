CREATE TABLE "user_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" varchar(200) NOT NULL,
	"description" text,
	"images" jsonb,
	"video_url" varchar(500),
	"is_public" boolean DEFAULT true,
	"tags" jsonb,
	"hackathon_name" varchar(200),
	"likes" integer DEFAULT 0,
	"project_url" varchar(500),
	"github_url" varchar(500),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location" varchar(255) DEFAULT '--';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "skills" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "interests" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
CREATE TABLE "project_evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"judge_id" uuid NOT NULL,
	"scores" jsonb,
	"feedback" text,
	"overall_score" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "project_evaluations" ADD CONSTRAINT "project_evaluations_project_id_user_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."user_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_evaluations" ADD CONSTRAINT "project_evaluations_judge_id_users_id_fk" FOREIGN KEY ("judge_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
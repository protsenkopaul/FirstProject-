CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "blog_authors" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "content" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "bio" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "passwordHash" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
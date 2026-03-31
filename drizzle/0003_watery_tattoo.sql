ALTER TABLE "blog_authors" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "blog_authors" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "blog_follows" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "blog_follows" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "blog_posts" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "blog_posts" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "blogs" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "blogs" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "follows" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "follows" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "likes" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "likes" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "post_tags" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "post_tags" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "refresh_tokens" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "tags" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "tags" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "views" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "views" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "revoked_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "updated_at" timestamp with time zone;
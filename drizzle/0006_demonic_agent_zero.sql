ALTER TABLE "blog_authors" RENAME COLUMN "blogAuthorId" TO "blog_author_id";--> statement-breakpoint
ALTER TABLE "blog_follows" RENAME COLUMN "blogFollowId" TO "blog_follow_id";--> statement-breakpoint
ALTER TABLE "blog_posts" RENAME COLUMN "blogPostId" TO "blog_post_id";--> statement-breakpoint
ALTER TABLE "blogs" RENAME COLUMN "blogId" TO "blog_id";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "commentId" TO "comment_id";--> statement-breakpoint
ALTER TABLE "follows" RENAME COLUMN "followId" TO "follow_id";--> statement-breakpoint
ALTER TABLE "likes" RENAME COLUMN "likeId" TO "like_id";--> statement-breakpoint
ALTER TABLE "post_tags" RENAME COLUMN "postTagId" TO "post_tag_id";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "postId" TO "post_id";--> statement-breakpoint
ALTER TABLE "refresh_tokens" RENAME COLUMN "refreshTokenId" TO "refresh_token_id";--> statement-breakpoint
ALTER TABLE "tags" RENAME COLUMN "tagId" TO "tag_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "views" RENAME COLUMN "viewId" TO "view_id";--> statement-breakpoint
ALTER TABLE "blog_authors" DROP CONSTRAINT "blog_authors_blog_id_blogs_blogId_fk";
--> statement-breakpoint
ALTER TABLE "blog_authors" DROP CONSTRAINT "blog_authors_author_id_users_userId_fk";
--> statement-breakpoint
ALTER TABLE "blog_follows" DROP CONSTRAINT "blog_follows_blog_id_blogs_blogId_fk";
--> statement-breakpoint
ALTER TABLE "blog_follows" DROP CONSTRAINT "blog_follows_follower_id_users_userId_fk";
--> statement-breakpoint
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_blog_id_blogs_blogId_fk";
--> statement-breakpoint
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_post_id_posts_postId_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_users_userId_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_commented_post_id_posts_postId_fk";
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_following_user_id_users_userId_fk";
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_followed_user_id_users_userId_fk";
--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_users_userId_fk";
--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likes_liked_post_id_posts_postId_fk";
--> statement-breakpoint
ALTER TABLE "post_tags" DROP CONSTRAINT "post_tags_tag_id_tags_tagId_fk";
--> statement-breakpoint
ALTER TABLE "post_tags" DROP CONSTRAINT "post_tags_post_id_posts_postId_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_user_id_users_userId_fk";
--> statement-breakpoint
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_users_userId_fk";
--> statement-breakpoint
ALTER TABLE "views" DROP CONSTRAINT "views_post_id_posts_postId_fk";
--> statement-breakpoint
ALTER TABLE "views" DROP CONSTRAINT "views_reader_id_users_userId_fk";
--> statement-breakpoint
ALTER TABLE "blog_authors" ADD CONSTRAINT "blog_authors_blog_id_blogs_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("blog_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_authors" ADD CONSTRAINT "blog_authors_author_id_users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_follows" ADD CONSTRAINT "blog_follows_blog_id_blogs_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("blog_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_follows" ADD CONSTRAINT "blog_follows_follower_id_users_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_blog_id_blogs_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("blog_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_commented_post_id_posts_post_id_fk" FOREIGN KEY ("commented_post_id") REFERENCES "public"."posts"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_user_id_users_user_id_fk" FOREIGN KEY ("following_user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_followed_user_id_users_user_id_fk" FOREIGN KEY ("followed_user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_liked_post_id_posts_post_id_fk" FOREIGN KEY ("liked_post_id") REFERENCES "public"."posts"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("tag_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "views" ADD CONSTRAINT "views_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "views" ADD CONSTRAINT "views_reader_id_users_user_id_fk" FOREIGN KEY ("reader_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
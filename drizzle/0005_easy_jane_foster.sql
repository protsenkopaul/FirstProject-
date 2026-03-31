ALTER TABLE "blog_authors" RENAME COLUMN "id" TO "blogAuthorId";--> statement-breakpoint
ALTER TABLE "blog_follows" RENAME COLUMN "id" TO "blogFollowId";--> statement-breakpoint
ALTER TABLE "blog_posts" RENAME COLUMN "id" TO "blogPostId";--> statement-breakpoint
ALTER TABLE "blogs" RENAME COLUMN "id" TO "blogId";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "id" TO "commentId";--> statement-breakpoint
ALTER TABLE "follows" RENAME COLUMN "id" TO "followId";--> statement-breakpoint
ALTER TABLE "likes" RENAME COLUMN "id" TO "likeId";--> statement-breakpoint
ALTER TABLE "post_tags" RENAME COLUMN "id" TO "postTagId";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "id" TO "postId";--> statement-breakpoint
ALTER TABLE "refresh_tokens" RENAME COLUMN "id" TO "refreshTokenId";--> statement-breakpoint
ALTER TABLE "tags" RENAME COLUMN "id" TO "tagId";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "id" TO "userId";--> statement-breakpoint
ALTER TABLE "views" RENAME COLUMN "id" TO "viewId";--> statement-breakpoint
ALTER TABLE "blog_authors" DROP CONSTRAINT "blog_authors_blog_id_blogs_id_fk";
--> statement-breakpoint
ALTER TABLE "blog_authors" DROP CONSTRAINT "blog_authors_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "blog_follows" DROP CONSTRAINT "blog_follows_blog_id_blogs_id_fk";
--> statement-breakpoint
ALTER TABLE "blog_follows" DROP CONSTRAINT "blog_follows_follower_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_blog_id_blogs_id_fk";
--> statement-breakpoint
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_commented_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_following_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_followed_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likes_liked_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_tags" DROP CONSTRAINT "post_tags_tag_id_tags_id_fk";
--> statement-breakpoint
ALTER TABLE "post_tags" DROP CONSTRAINT "post_tags_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "views" DROP CONSTRAINT "views_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "views" DROP CONSTRAINT "views_reader_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "blog_authors" ADD CONSTRAINT "blog_authors_blog_id_blogs_blogId_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("blogId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_authors" ADD CONSTRAINT "blog_authors_author_id_users_userId_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_follows" ADD CONSTRAINT "blog_follows_blog_id_blogs_blogId_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("blogId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_follows" ADD CONSTRAINT "blog_follows_follower_id_users_userId_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_blog_id_blogs_blogId_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("blogId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_post_id_posts_postId_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("postId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_userId_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_commented_post_id_posts_postId_fk" FOREIGN KEY ("commented_post_id") REFERENCES "public"."posts"("postId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_user_id_users_userId_fk" FOREIGN KEY ("following_user_id") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_followed_user_id_users_userId_fk" FOREIGN KEY ("followed_user_id") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_userId_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_liked_post_id_posts_postId_fk" FOREIGN KEY ("liked_post_id") REFERENCES "public"."posts"("postId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_tagId_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("tagId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_postId_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("postId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_userId_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_userId_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "views" ADD CONSTRAINT "views_post_id_posts_postId_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("postId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "views" ADD CONSTRAINT "views_reader_id_users_userId_fk" FOREIGN KEY ("reader_id") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_blog_author" ON "blog_authors" USING btree ("blog_id","author_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_blog_follow" ON "blog_follows" USING btree ("blog_id","follower_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_blog_post" ON "blog_posts" USING btree ("blog_id","post_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_follow" ON "follows" USING btree ("following_user_id","followed_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_like" ON "likes" USING btree ("user_id","liked_post_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_post_tag" ON "post_tags" USING btree ("tag_id","post_id");--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");
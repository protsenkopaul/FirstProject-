import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  username: text().notNull().unique(),
  bio: text(),
  passwordHash: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  postId: uuid("post_id").primaryKey().defaultRandom(),
  title: text().notNull(),
  body: text("body").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  status: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const follows = pgTable("follows", {
  followId: uuid("follow_id").primaryKey().defaultRandom(),
  followingUserId: uuid("following_user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  followedUserId: uuid("followed_user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueFollow: uniqueIndex("unique_follow").on(table.followingUserId, table.followedUserId),
}));

export const likes = pgTable("likes", {
  likeId: uuid("like_id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  likedPostId: uuid("liked_post_id")
    .notNull()
    .references(() => posts.postId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueLike: uniqueIndex("unique_like").on(table.userId, table.likedPostId),
}));

export const comments = pgTable("comments", {
  commentId: uuid("comment_id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  commentedPostId: uuid("commented_post_id")
    .notNull()
    .references(() => posts.postId, { onDelete: "cascade" }),
  content: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tags = pgTable("tags", {
  tagId: uuid("tag_id").primaryKey().defaultRandom(),
  name: text().notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const postTags = pgTable("post_tags", {
  postTagId: uuid("post_tag_id").primaryKey().defaultRandom(),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.tagId, { onDelete: "cascade" }),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.postId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniquePostTag: uniqueIndex("unique_post_tag").on(table.tagId, table.postId),
}));

export const blogs = pgTable("blogs", {
  blogId: uuid("blog_id").primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  blogPostId: uuid("blog_post_id").primaryKey().defaultRandom(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.blogId, { onDelete: "cascade" }),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.postId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueBlogPost: uniqueIndex("unique_blog_post").on(table.blogId, table.postId),
}));

export const blogAuthors = pgTable("blog_authors", {
  blogAuthorId: uuid("blog_author_id").primaryKey().defaultRandom(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.blogId, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  role: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueBlogAuthor: uniqueIndex("unique_blog_author").on(table.blogId, table.authorId),
}));

export const blogFollows = pgTable("blog_follows", {
  blogFollowId: uuid("blog_follow_id").primaryKey().defaultRandom(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.blogId, { onDelete: "cascade" }),
  followerId: uuid("follower_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueBlogFollow: uniqueIndex("unique_blog_follow").on(table.blogId, table.followerId),
}));

export const views = pgTable("views", {
  viewId: uuid("view_id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.postId, { onDelete: "cascade" }),
  readerId: uuid("reader_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  refreshTokenId: uuid("refresh_token_id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  token: text().notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

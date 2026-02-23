import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: text().notNull(),
  bio: text(),
  passwordHash: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const posts = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  body: text("body").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  status: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const follows = pgTable("follows", {
  id: uuid().primaryKey().defaultRandom(),
  followingUserId: uuid("following_user_id").references(() => users.id),
  followedUserId: uuid("followed_user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const likes = pgTable("likes", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  likedPostId: uuid("liked_post_id").references(() => posts.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const comments = pgTable("comments", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  commentedPostId: uuid("commented_post_id").references(() => posts.id),
  content: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const tags = pgTable("tags", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().unique().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const postTags = pgTable("post_tags", {
  id: uuid().primaryKey().defaultRandom(),
  tagId: uuid("tag_id").references(() => tags.id),
  postId: uuid("post_id").references(() => posts.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const blogs = pgTable("blogs", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid().primaryKey().defaultRandom(),
  blogId: uuid("blog_id").references(() => blogs.id),
  postId: uuid("post_id").references(() => posts.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const blogAuthors = pgTable("blog_authors", {
  id: uuid().primaryKey().defaultRandom(),
  blogId: uuid("blog_id").references(() => blogs.id),
  authorId: uuid("author_id").references(() => users.id),
  role: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const blogFollows = pgTable("blog_follows", {
  id: uuid().primaryKey().defaultRandom(),
  blogId: uuid("blog_id").references(() => blogs.id),
  followerId: uuid("follower_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const views = pgTable("views", {
  id: uuid().primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id),
  readerId: uuid("reader_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  token: text().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});
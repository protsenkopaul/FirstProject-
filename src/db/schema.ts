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
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  body: text("body").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  status: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const follows = pgTable("follows", {
  id: uuid().primaryKey().defaultRandom(),
  followingUserId: uuid("following_user_id").references(() => users.id),
  followedUserId: uuid("followed_user_id").references(() => users.id),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const likes = pgTable("likes", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  likedPostId: uuid("liked_post_id").references(() => posts.id),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  commentedPostId: uuid("commented_post_id").references(() => posts.id),
  content: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const tags = pgTable("tags", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().unique().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const postTags = pgTable("post_tags", {
  id: uuid().primaryKey().defaultRandom(),
  tagId: uuid("tag_id").references(() => tags.id),
  postId: uuid("post_id").references(() => posts.id),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const blogs = pgTable("blogs", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid().primaryKey().defaultRandom(),
  blogId: uuid("blog_id").references(() => blogs.id),
  postId: uuid("post_id").references(() => posts.id),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const blogAuthors = pgTable("blog_authors", {
  id: uuid().primaryKey().defaultRandom(),
  blogId: uuid("blog_id").references(() => blogs.id),
  authorId: uuid("author_id").references(() => users.id),
  role: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const blogFollows = pgTable("blog_follows", {
  id: uuid().primaryKey().defaultRandom(),
  blogId: uuid("blog_id").references(() => blogs.id),
  followerId: uuid("follower_id").references(() => users.id),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const views = pgTable("views", {
  id: uuid().primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id),
  readerId: uuid("reader_id").references(() => users.id),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});
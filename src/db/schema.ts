import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).notNull(),
  bio: varchar({ length: 1024 }),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  body: text("body").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  status: varchar({ length: 50 }),
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
  content: varchar({ length: 2000 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const tags = pgTable("tags", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).unique().notNull(),
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
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1024 }),
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
  role: varchar({ length: 100 }),
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
import { relations } from "drizzle-orm";
import {
  users,
  posts,
  follows,
  likes,
  comments,
  tags,
  postTags,
  blogs,
  blogPosts,
  blogAuthors,
  blogFollows,
  views,
  refreshTokens,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(likes),
  comments: many(comments),
  refreshTokens: many(refreshTokens),
  views: many(views),
  following: many(follows, { relationName: "following" }),
  followers: many(follows, { relationName: "followers" }),
  blogAuthors: many(blogAuthors),
  blogFollows: many(blogFollows),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.userId],
  }),
  likes: many(likes),
  comments: many(comments),
  postTags: many(postTags),
  blogPosts: many(blogPosts),
  views: many(views),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  followingUser: one(users, {
    fields: [follows.followingUserId],
    references: [users.userId],
    relationName: "following",
  }),
  followedUser: one(users, {
    fields: [follows.followedUserId],
    references: [users.userId],
    relationName: "followers",
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.userId],
  }),
  post: one(posts, {
    fields: [likes.likedPostId],
    references: [posts.postId],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.userId],
  }),
  post: one(posts, {
    fields: [comments.commentedPostId],
    references: [posts.postId],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.tagId],
  }),
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.postId],
  }),
}));

export const blogsRelations = relations(blogs, ({ many }) => ({
  blogPosts: many(blogPosts),
  blogAuthors: many(blogAuthors),
  blogFollows: many(blogFollows),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogPosts.blogId],
    references: [blogs.blogId],
  }),
  post: one(posts, {
    fields: [blogPosts.postId],
    references: [posts.postId],
  }),
}));

export const blogAuthorsRelations = relations(blogAuthors, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogAuthors.blogId],
    references: [blogs.blogId],
  }),
  author: one(users, {
    fields: [blogAuthors.authorId],
    references: [users.userId],
  }),
}));

export const blogFollowsRelations = relations(blogFollows, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogFollows.blogId],
    references: [blogs.blogId],
  }),
  follower: one(users, {
    fields: [blogFollows.followerId],
    references: [users.userId],
  }),
}));

export const viewsRelations = relations(views, ({ one }) => ({
  post: one(posts, {
    fields: [views.postId],
    references: [posts.postId],
  }),
  reader: one(users, {
    fields: [views.readerId],
    references: [users.userId],
  }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.userId],
  }),
}));

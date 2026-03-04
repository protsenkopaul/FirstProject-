import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as relations from './db/relations';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool);

export const usersRelations = relations.usersRelations;
export const postsRelations = relations.postsRelations;
export const followsRelations = relations.followsRelations;
export const likesRelations = relations.likesRelations;
export const commentsRelations = relations.commentsRelations;
export const tagsRelations = relations.tagsRelations;
export const postTagsRelations = relations.postTagsRelations;
export const blogsRelations = relations.blogsRelations;
export const blogPostsRelations = relations.blogPostsRelations;
export const blogAuthorsRelations = relations.blogAuthorsRelations;
export const blogFollowsRelations = relations.blogFollowsRelations;
export const viewsRelations = relations.viewsRelations;
export const refreshTokensRelations = relations.refreshTokensRelations;

export default db;

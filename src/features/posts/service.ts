import { db } from "../../db.js";
import { posts, follows, likes } from "../../db/schema.js";
import { eq, inArray, desc, count } from "drizzle-orm";
import { z } from "zod";
import { HTTPException } from 'hono/http-exception';
import { CreatePostSchema, UpdatePostSchema } from "./schemas.js";

export type Post = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
};

export async function createPost(params: z.infer<typeof CreatePostSchema>): Promise<Post> {
  const inserted = await db
    .insert(posts)
    .values({ title: params.title, body: params.content, userId: params.authorId })
    .returning();
  const row = inserted[0];
  return {
    id: row.postId,
    authorId: row.userId,
    title: row.title,
    content: row.body,
    createdAt: row.createdAt ? row.createdAt.toISOString() : '',
    likes: 0,
  };
}

export async function getFeed(authorId: string): Promise<Post[]> {
  const followingList = await db
    .select({ followedUserId: follows.followedUserId })
    .from(follows)
    .where(eq(follows.followingUserId, authorId));
  const followedIds = followingList.map((f) => f.followedUserId).filter((id): id is string => id !== null);
  if (followedIds.length === 0) return [];

  const feedPosts = await db
    .select()
    .from(posts)
    .where(inArray(posts.userId, followedIds))
    .orderBy(desc(posts.createdAt));

  return feedPosts.map((row) => ({
    id: row.postId,
    authorId: row.userId,
    title: row.title,
    content: row.body,
    createdAt: row.createdAt ? row.createdAt.toISOString() : '',
    likes: 0,
  }));
}

export async function getPostById(id: string): Promise<Post> {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.postId, id))
    .limit(1);
  
  if (result.length === 0) throw new HTTPException(404, { message: 'Post not found' });
  
  const row = result[0];
  const [likeCount] = await db
    .select({ count: count() })
    .from(likes)
    .where(eq(likes.likedPostId, row.postId));
  
  return {
    id: row.postId,
    authorId: row.userId,
    title: row.title,
    content: row.body,
    createdAt: row.createdAt ? row.createdAt.toISOString() : '',
    likes: likeCount?.count ?? 0,
  };
}

export async function updatePost(
  id: string,
  userId: string,
  params: z.infer<typeof UpdatePostSchema>
): Promise<Post> {
  const existing = await db
    .select()
    .from(posts)
    .where(eq(posts.postId, id))
    .limit(1);
  
  if (existing.length === 0) throw new HTTPException(404, { message: 'Post not found' });
  if (existing[0].userId !== userId) throw new HTTPException(403, { message: 'Unauthorized' });
  
  const updateValues: { title?: string; body?: string } = {};
  if (params.title) updateValues.title = params.title;
  if (params.content) updateValues.body = params.content;
  
  const updated = await db
    .update(posts)
    .set({ ...updateValues, updatedAt: new Date() })
    .where(eq(posts.postId, id))
    .returning();
  
  const row = updated[0];
  return {
    id: row.postId,
    authorId: row.userId,
    title: row.title,
    content: row.body,
    createdAt: row.createdAt ? row.createdAt.toISOString() : '',
    likes: 0,
  };
}

export async function deletePost(id: string, userId: string): Promise<void> {
  const existing = await db
    .select()
    .from(posts)
    .where(eq(posts.postId, id))
    .limit(1);
  
  if (existing.length === 0) throw new HTTPException(404, { message: 'Post not found' });
  if (existing[0].userId !== userId) throw new HTTPException(403, { message: 'Unauthorized' });
  
  await db.delete(posts).where(eq(posts.postId, id));
}

export async function getPostsByUserId(userId: string): Promise<Post[]> {
  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt));
  
  return userPosts.map((row) => ({
    id: row.postId,
    authorId: row.userId,
    title: row.title,
    content: row.body,
    createdAt: row.createdAt ? row.createdAt.toISOString() : '',
    likes: 0,
  }));
}

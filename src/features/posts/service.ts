import { db } from "../../db.js";
import { posts, follows, likes } from "../../db/schema.js";
import { eq, inArray, desc, and } from "drizzle-orm";

export type Post = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
};

export async function createPost(authorId: string, title: string, content: string): Promise<Post> {
  const inserted = await db
    .insert(posts)
    .values({ title, body: content, userId: authorId })
    .returning();
  const row = inserted[0];
  return {
    id: row.id,
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
    id: row.id,
    authorId: row.userId,
    title: row.title,
    content: row.body,
    createdAt: row.createdAt ? row.createdAt.toISOString() : '',
    likes: 0,
  }));
}

export async function getPostById(id: string): Promise<Post | null> {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  
  if (result.length === 0) return null;
  
  const row = result[0];
  const likeCount = await db
    .select({ id: likes.id })
    .from(likes)
    .where(eq(likes.likedPostId, row.id));
  
  return {
    id: row.id,
    authorId: row.userId,
    title: row.title,
    content: row.body,
    createdAt: row.createdAt ? row.createdAt.toISOString() : '',
    likes: likeCount.length,
  };
}

export async function updatePost(
  id: string,
  userId: string,
  title?: string,
  content?: string
): Promise<Post | null> {
  const existing = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  
  if (existing.length === 0) return null;
  if (existing[0].userId !== userId) return null;
  
  const updateValues: { title?: string; body?: string } = {};
  if (title) updateValues.title = title;
  if (content) updateValues.body = content;
  
  const updated = await db
    .update(posts)
    .set({ ...updateValues, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  
  const row = updated[0];
  return {
    id: row.id,
    authorId: row.userId,
    title: row.title,
    content: row.body,
    createdAt: row.createdAt ? row.createdAt.toISOString() : '',
    likes: 0,
  };
}

export async function deletePost(id: string, userId: string): Promise<boolean> {
  const existing = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  
  if (existing.length === 0) return false;
  if (existing[0].userId !== userId) return false;
  
  await db.delete(likes).where(eq(likes.likedPostId, id));
  await db.delete(posts).where(eq(posts.id, id));
  
  return true;
}

export async function getPostsByUserId(userId: string): Promise<Post[]> {
  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt));
  
  return userPosts.map((row) => ({
    id: row.id,
    authorId: row.userId,
    title: row.title,
    content: row.body,
    createdAt: row.createdAt ? row.createdAt.toISOString() : '',
    likes: 0,
  }));
}

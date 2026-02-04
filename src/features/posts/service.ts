import { db } from "../../db.js";
import { posts, follows } from "../../db/schema.js";
import { eq, inArray, desc } from "drizzle-orm";

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

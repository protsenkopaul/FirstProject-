import { db } from "../db.js";
import { users, follows } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import argon2 from 'argon2'

type UserRow = {
  id: string;
  username?: string;
  name?: string;
  bio?: string | null;
  createdAt?: Date;
};

const normalizeUserRow = (row: UserRow) => ({
  id: row.id,
  name: row.username || row.name,
  bio: row.bio,
  createdAt: row.createdAt,
  following: [] as string[],
});

export async function createAuthor(name: string, bio?: string) {
  const inserted = await db
    .insert(users)
    .values({ username: name, bio })
    .returning();
  const row = inserted[0];
  return normalizeUserRow(row as UserRow);
}

export function hashPassword(password: string) {
    return argon2.hash(password, {
    type: argon2.argon2id
  })
}

export async function followAuthor(followerId: string, targetId: string) {
  const follower = await db.select({ id: users.id }).from(users).where(eq(users.id, followerId));
  if (follower.length === 0) throw new Error('Follower not found');
  
  const target = await db.select({ id: users.id }).from(users).where(eq(users.id, targetId));
  if (target.length === 0) throw new Error('Target not found');

  const existingFollow = await db
    .select({ id: follows.id })
    .from(follows)
    .where(and(eq(follows.followingUserId, followerId), eq(follows.followedUserId, targetId)));
  if (existingFollow.length === 0) {
    await db.insert(follows).values({ followingUserId: followerId, followedUserId: targetId });
  }

  const followingList = await db
    .select({ followedUserId: follows.followedUserId })
    .from(follows)
    .where(eq(follows.followingUserId, followerId));

  return {
    id: followerId,
    following: followingList.map(f => f.followedUserId),
  };
}
import { db } from "../../db.js";
import { users, follows } from "../../db/schema.js";
import { eq, and, count } from "drizzle-orm";
import { z } from "zod";
import { HTTPException } from 'hono/http-exception';
import { CreateAuthorSchema, UpdateAuthorSchema } from "./schemas.js";

type UserRow = {
  userId: string;
  username?: string;
  name?: string;
  bio?: string | null;
  createdAt?: Date;
  followersCount?: number;
  followingCount?: number;
};

const normalizeUserRow = (row: UserRow) => ({
  id: row.userId,
  name: row.username || row.name,
  bio: row.bio,
  createdAt: row.createdAt,
  following: [] as string[],
});

export async function createAuthor(params: z.infer<typeof CreateAuthorSchema>) {
  const inserted = await db
    .insert(users)
    .values({ username: params.name, bio: params.bio })
    .returning();
  const row = inserted[0];
  return normalizeUserRow(row as UserRow);
}

export async function followAuthor(params: { followerId: string; targetId: string }) {
  return await db.transaction(async (tx) => {
    const follower = await tx.select({ userId: users.userId }).from(users).where(eq(users.userId, params.followerId));
    if (follower.length === 0) throw new HTTPException(404, { message: 'Follower not found' });

    const target = await tx.select({ userId: users.userId }).from(users).where(eq(users.userId, params.targetId));
    if (target.length === 0) throw new HTTPException(404, { message: 'Target not found' });

    const existingFollow = await tx
      .select({ followId: follows.followId })
      .from(follows)
      .where(and(eq(follows.followingUserId, params.followerId), eq(follows.followedUserId, params.targetId)));
    if (existingFollow.length === 0) {
      await tx.insert(follows).values({ followingUserId: params.followerId, followedUserId: params.targetId });
    }

    const followingList = await tx
      .select({ followedUserId: follows.followedUserId })
      .from(follows)
      .where(eq(follows.followingUserId, params.followerId));

    return {
      id: params.followerId,
      following: followingList.map(f => f.followedUserId),
    };
  });
}

export async function getAuthorById(id: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.userId, id))
    .limit(1);
  
  if (result.length === 0) throw new HTTPException(404, { message: 'Author not found' });
  
  const row = result[0];
  
  const [followersCount, followingCount] = await Promise.all([
    db.select({ count: count() }).from(follows).where(eq(follows.followedUserId, id)),
    db.select({ count: count() }).from(follows).where(eq(follows.followingUserId, id)),
  ]);
  
  return {
    id: row.userId,
    username: row.username,
    bio: row.bio,
    createdAt: row.createdAt?.toISOString(),
    followersCount: followersCount[0]?.count ?? 0,
    followingCount: followingCount[0]?.count ?? 0,
  };
}

export async function updateAuthor(id: string, params: z.infer<typeof UpdateAuthorSchema>) {
  const updateValues: { username?: string; bio?: string } = {};
  if (params.name) updateValues.username = params.name;
  if (params.bio !== undefined) updateValues.bio = params.bio;
  
  const updated = await db
    .update(users)
    .set({ ...updateValues, updatedAt: new Date() })
    .where(eq(users.userId, id))
    .returning();
  
  if (updated.length === 0) throw new HTTPException(404, { message: 'Author not found' });
  
  const row = updated[0];
  return {
    id: row.userId,
    username: row.username,
    bio: row.bio,
    createdAt: row.createdAt?.toISOString(),
  };
}

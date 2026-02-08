import { db } from "../../db.js";
import { users, follows } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";

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

export async function followAuthor(followerId: string, targetId: string) {
  return await db.transaction(async (tx) => {
    const follower = await tx.select({ id: users.id }).from(users).where(eq(users.id, followerId));
    if (follower.length === 0) throw new Error('Follower not found');

    const target = await tx.select({ id: users.id }).from(users).where(eq(users.id, targetId));
    if (target.length === 0) throw new Error('Target not found');

    const existingFollow = await tx
      .select({ id: follows.id })
      .from(follows)
      .where(and(eq(follows.followingUserId, followerId), eq(follows.followedUserId, targetId)));
    if (existingFollow.length === 0) {
      await tx.insert(follows).values({ followingUserId: followerId, followedUserId: targetId });
    }

    const followingList = await tx
      .select({ followedUserId: follows.followedUserId })
      .from(follows)
      .where(eq(follows.followingUserId, followerId));

    return {
      id: followerId,
      following: followingList.map(f => f.followedUserId),
    };
  });
}

import { db } from "../../db.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import argon2 from 'argon2'

export function hashPassword(password: string) {
    return argon2.hash(password, {
    type: argon2.argon2id
  })
}

export async function registerUser(username: string, password: string) {
  return await db.transaction(async (tx) => {
    const existingUsers = await tx.select({ id: users.id }).from(users).where(eq(users.username, username));
    if (existingUsers.length > 0) {
      throw new Error('Username already exists');
    }

    const passwordHash = await hashPassword(password);
    const insertedUsers = await tx.insert(users).values({ username, passwordHash }).returning();
    const user = insertedUsers[0];
    return { id: user.id, username: user.username, createdAt: user.createdAt };
  });
}

import { db } from "../../db.js";
import { users, refreshTokens } from "../../db/schema.js";
import { eq, and, gt, isNull } from "drizzle-orm";
import argon2 from 'argon2'
import { SignJWT, jwtVerify } from 'jose';
import { JWTPayload, JWTPayloadSchema } from "../../schemas.js";

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

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(userId: string, username: string): Promise<string> {
  const token = await new SignJWT({ userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
  
  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return JWTPayloadSchema.parse(payload);
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await db.insert(refreshTokens).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function verifyRefreshToken(token: string): Promise<string | null> {
  const validTokens = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  if (validTokens.length === 0) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, token));
}

export async function refreshAccessToken(refreshToken: string) {
  const userId = await verifyRefreshToken(refreshToken);
  
  if (!userId) {
    throw new Error('Invalid or expired refresh token');
  }

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  
  if (user.length === 0) {
    throw new Error('User not found');
  }

  await revokeRefreshToken(refreshToken);

  const newAccessToken = await generateToken(user[0].id, user[0].username);
  const newRefreshToken = await generateRefreshToken(user[0].id);

  return {
    token: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      id: user[0].id,
      username: user[0].username,
    },
  };
}

export async function loginUser(username: string, password: string) {
  const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
  
  if (user.length === 0) {
    throw new Error('Invalid credentials');
  }
  
  const isValidPassword = await argon2.verify(user[0].passwordHash!, password);
  
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }
  
  const token = await generateToken(user[0].id, user[0].username);
  const refreshToken = await generateRefreshToken(user[0].id);
  
  return {
    token,
    refreshToken,
    user: {
      id: user[0].id,
      username: user[0].username,
    },
  };
}
